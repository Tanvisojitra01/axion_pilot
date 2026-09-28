import json
import re
import os
import logging
from .llm_client import LLMClient

logger = logging.getLogger(__name__)
from ..prompts.system_prompts import PROJECT_GENERATOR_SYSTEM_PROMPT
from ..prompts.templates import (
    IDEA_EXPANSION_PROMPT,
    ARCHITECTURE_PLANNING_PROMPT,
    CODEBASE_GENERATION_PROMPT,
    FLASK_CODEBASE_PROMPT,
    DOCUMENTATION_PROMPT,
    VIVA_PREP_PROMPT
)


def extract_json(text):
    """Robust multi-strategy JSON extraction from LLM response."""
    if not text:
        return None

    original = text
    try:
        # Strategy 1: Direct parse
        return json.loads(text.strip(), strict=False)
    except Exception:
        pass

    try:
        # Strategy 2: Strip markdown code fences then parse
        text = re.sub(r'```(?:json)?', '', text).strip()
        return json.loads(text, strict=False)
    except Exception:
        pass

    try:
        # Strategy 3: Find outermost { } block
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end > start:
            json_str = text[start:end]
            # Clean invalid control characters (keep \n \r \t)
            clean_str = re.sub(r'[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]', '', json_str)
            return json.loads(clean_str, strict=False)
    except Exception:
        pass

    try:
        # Strategy 4: Repair common LLM JSON mistakes
        text = original
        text = re.sub(r'```(?:json)?', '', text).strip()
        # Replace unescaped newlines inside string values
        text = re.sub(r'(?<!\\)\n', '\\n', text)
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end > start:
            return json.loads(text[start:end], strict=False)
    except Exception:
        pass

    logger.warning("extract_json: All strategies failed, returning None")
    return None


def _fallback_files(topic, tech_stack, overview):
    """Generate a minimal working fallback code structure."""
    is_flask = "flask" in tech_stack.lower()
    is_python = "python" in tech_stack.lower()

    if is_flask or is_python:
        return [
            {
                "filename": "app.py",
                "content": f"""from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'your-secret-key-here'
db = SQLAlchemy(app)


class Record(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Record {{self.title}}>'


@app.route('/')
def index():
    records = Record.query.order_by(Record.created_at.desc()).all()
    return render_template('index.html', records=records, title='{topic}')


@app.route('/create', methods=['GET', 'POST'])
def create():
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        if title:
            record = Record(title=title, description=description)
            db.session.add(record)
            db.session.commit()
            return redirect(url_for('index'))
    return render_template('create.html', title='Add New Record')


@app.route('/delete/<int:id>')
def delete(id):
    record = Record.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return redirect(url_for('index'))


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
"""
            },
            {
                "filename": "requirements.txt",
                "content": "flask==2.3.3\nflask-sqlalchemy==3.1.1\npython-dotenv==1.0.0\ngunicorn==21.2.0"
            },
            {
                "filename": "templates/base.html",
                "content": f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{topic}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{{{ url_for('static', filename='css/style.css') }}}}">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand fw-bold" href="/">{topic}</a>
        </div>
    </nav>
    <div class="container mt-4">
        {{% block content %}}{{% endblock %}}
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>"""
            },
            {
                "filename": "templates/index.html",
                "content": """{{% extends 'base.html' %}}
{{% block content %}}
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>{{ title }}</h2>
    <a href="/create" class="btn btn-primary">+ Add New</a>
</div>
{{% if records %}}
<div class="row">
    {{% for record in records %}}
    <div class="col-md-4 mb-3">
        <div class="card shadow-sm">
            <div class="card-body">
                <h5 class="card-title">{{ record.title }}</h5>
                <p class="card-text text-muted">{{ record.description }}</p>
                <small class="text-muted">{{ record.created_at.strftime('%Y-%m-%d') }}</small>
                <div class="mt-2">
                    <a href="/delete/{{ record.id }}" class="btn btn-sm btn-danger" onclick="return confirm('Delete?')">Delete</a>
                </div>
            </div>
        </div>
    </div>
    {{% endfor %}}
</div>
{{% else %}}
<div class="alert alert-info">No records yet. <a href="/create">Add the first one!</a></div>
{{% endif %}}
{{% endblock %}}"""
            },
            {
                "filename": "templates/create.html",
                "content": """{{% extends 'base.html' %}}
{{% block content %}}
<h2>{{ title }}</h2>
<form method="POST" class="mt-3">
    <div class="mb-3">
        <label class="form-label">Title *</label>
        <input type="text" name="title" class="form-control" required>
    </div>
    <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea name="description" class="form-control" rows="4"></textarea>
    </div>
    <button type="submit" class="btn btn-primary">Save</button>
    <a href="/" class="btn btn-secondary ms-2">Cancel</a>
</form>
{{% endblock %}}"""
            },
            {
                "filename": "static/css/style.css",
                "content": """body { background-color: #f8f9fa; }
.card { border: none; border-radius: 12px; }
.navbar { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.card:hover { transform: translateY(-2px); transition: 0.2s; box-shadow: 0 6px 20px rgba(0,0,0,0.1); }"""
            },
            {
                "filename": "README.md",
                "content": f"""# {topic}

## Description
{overview}

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Application
```bash
python app.py
```

### 3. Open in Browser
Navigate to: http://localhost:5000

## Tech Stack
{tech_stack}

## Features
- Create, read, and delete records
- Bootstrap 5 responsive UI
- SQLite database (auto-created on first run)
- Clean MVC architecture
"""
            }
        ]
    else:
        return [
            {
                "filename": "main.py",
                "content": f"""#!/usr/bin/env python3
\"\"\"
{topic}
{overview}
\"\"\"

def main():
    print("Starting {topic}...")
    # TODO: Implement core logic for {tech_stack}
    print("Application started successfully!")

if __name__ == '__main__':
    main()
"""
            },
            {
                "filename": "requirements.txt",
                "content": "# Add your project dependencies here\n"
            },
            {
                "filename": "README.md",
                "content": f"""# {topic}

## Description
{overview}

## Setup
1. Install dependencies: `pip install -r requirements.txt`
2. Run: `python main.py`

## Tech Stack
{tech_stack}
"""
            }
        ]


def generate_project(api_key, provider, domain, topic, description, difficulty, tech_stack, level, ai_config=None):
    client = LLMClient(api_key=api_key, provider=provider)

    # Extract AI Config
    config = ai_config or {}
    temp = config.get("temperature", 0.7)
    tokens = config.get("max_tokens", 4096)
    pipeline_features = config.get("features", {
        "advanced_mode": True,
        "deep_code": True,
        "extended_docs": True,
        "arch_planning": True
    })

    # ── STAGE 1: IDEA EXPANSION ───────────────────────────────────────────────
    logger.info("Pipeline Stage 1: Idea Expansion")
    idea_prompt = IDEA_EXPANSION_PROMPT.format(
        domain=domain, topic=topic, description=description,
        difficulty=difficulty, level=level
    )
    res_idea = client.generate(idea_prompt, system_prompt=PROJECT_GENERATOR_SYSTEM_PROMPT,
                               temperature=temp, max_tokens=tokens)
    idea_data = extract_json(res_idea) or {}

    title         = idea_data.get("expanded_title", topic)
    overview      = idea_data.get("project_overview", description)
    features_list = idea_data.get("features", [])

    logger.info(f"Stage 1 complete. Title: {title}, Features: {len(features_list)}")

    # ── STAGE 2: ARCHITECTURE PLANNING ────────────────────────────────────────
    arch_data = {}
    if pipeline_features.get("arch_planning", True):
        logger.info("Pipeline Stage 2: Architecture Planning")
        arch_prompt = ARCHITECTURE_PLANNING_PROMPT.format(
            title=title,
            overview=overview,
            features=", ".join(features_list[:5]),  # limit length for local LLM
            tech_stack=tech_stack
        )
        res_arch = client.generate(arch_prompt, system_prompt=PROJECT_GENERATOR_SYSTEM_PROMPT,
                                   temperature=temp, max_tokens=tokens)
        arch_data = extract_json(res_arch) or {}
        logger.info(f"Stage 2 complete. Arch keys: {list(arch_data.keys())}")

    # ── STAGE 3: CODEBASE GENERATION ─────────────────────────────────────────
    code_data = {"files": []}
    if pipeline_features.get("deep_code", True):
        logger.info("Pipeline Stage 3: Codebase Generation")
        if "flask" in tech_stack.lower():
            code_prompt = FLASK_CODEBASE_PROMPT.format(
                title=title, overview=overview, difficulty=difficulty, level=level
            )
        else:
            code_prompt = CODEBASE_GENERATION_PROMPT.format(
                architecture=arch_data.get("system_architecture", "Standard MVC Architecture"),
                tech_stack=tech_stack,
                difficulty=difficulty,
                level=level
            )

        res_code = client.generate(code_prompt, system_prompt=PROJECT_GENERATOR_SYSTEM_PROMPT,
                                   temperature=temp, max_tokens=tokens)
        parsed = extract_json(res_code)

        if parsed and isinstance(parsed.get("files"), list) and len(parsed["files"]) > 0:
            # Validate files have content
            valid_files = [
                f for f in parsed["files"]
                if isinstance(f, dict) and f.get("filename") and f.get("content")
                and len(str(f.get("content", ""))) > 20  # not empty/placeholder
            ]
            if valid_files:
                code_data = {"files": valid_files}
                logger.info(f"Stage 3 complete. Generated {len(valid_files)} valid files.")
            else:
                logger.warning("Stage 3: Files were empty/placeholders, using fallback.")
                code_data = {"files": _fallback_files(title, tech_stack, overview)}
        else:
            logger.warning(f"Stage 3: JSON parse failed or no files, using fallback. Raw: {str(res_code)[:200]}")
            code_data = {"files": _fallback_files(title, tech_stack, overview)}

    # ── STAGE 4: DOCUMENTATION ────────────────────────────────────────────────
    doc_data = {}
    if pipeline_features.get("extended_docs", True):
        logger.info("Pipeline Stage 4: Documentation Generation")
        doc_prompt = DOCUMENTATION_PROMPT.format(
            concept=overview,
            architecture=arch_data.get("system_architecture", "Standard MVC Architecture")
        )
        res_doc = client.generate(doc_prompt, system_prompt=PROJECT_GENERATOR_SYSTEM_PROMPT,
                                  temperature=temp, max_tokens=tokens)
        doc_data = extract_json(res_doc) or {}
        logger.info(f"Stage 4 complete. Doc keys: {list(doc_data.keys())}")

    # ── STAGE 5: VIVA PREP ────────────────────────────────────────────────────
    logger.info("Pipeline Stage 5: Viva Preparation")
    file_names = [f.get("filename", "") for f in code_data.get("files", [])]
    viva_prompt = VIVA_PREP_PROMPT.format(
        title=title,
        architecture=arch_data.get("system_architecture", "Standard Architecture")[:300],
        code_summary=f"Files: {', '.join(file_names[:6])}"
    )
    res_viva = client.generate(viva_prompt, system_prompt=PROJECT_GENERATOR_SYSTEM_PROMPT,
                               temperature=temp, max_tokens=tokens)
    viva_data = extract_json(res_viva) or {"viva_questions": []}
    logger.info(f"Stage 5 complete. Viva questions: {len(viva_data.get('viva_questions', []))}")

    # ── Consolidated Result ───────────────────────────────────────────────────
    return {
        "title":                  title,
        "abstract":               doc_data.get("abstract", overview),
        "problem_statement":      doc_data.get("problem_statement", ""),
        "architecture_description": arch_data.get("system_architecture", ""),
        "tech_stack_details":     arch_data.get("tech_stack_details", {}),
        "files":                  code_data.get("files", []),
        "viva_questions":         viva_data.get("viva_questions", []),
        "tags":                   [domain, difficulty],
        "estimated_completion_time": "2-3 Weeks",
        "domain":                 domain,
        "difficulty":             difficulty,
        "features":               features_list,
        "database_design":        arch_data.get("database_design", ""),
        "logic_flow":             arch_data.get("logic_flow", ""),
        "security_measures":      arch_data.get("security_measures", ""),
        "literature_survey":      doc_data.get("literature_survey", ""),
        "methodology":            doc_data.get("methodology", ""),
    }
