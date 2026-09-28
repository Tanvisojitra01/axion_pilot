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
    VIVA_PREP_PROMPT,
    UNIFIED_SPEC_PROMPT,
    FAST_CODEBASE_PROMPT
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
    import concurrent.futures

    client = LLMClient(api_key=api_key, provider=provider)
    config = ai_config or {}
    temp = config.get("temperature", 0.7)
    tokens = config.get("max_tokens", 4096)

    topic_clean = topic or f"{domain} Production System"
    desc_clean = description or f"A {difficulty} level engineering system for {domain} built with {tech_stack}."

    logger.info(f"Starting High-Performance Parallel Project Synthesis for: '{topic_clean}'")

    def synthesize_blueprint():
        """Generates title, overview, features, architecture, database, SRS doc, and viva prep in 1 optimized call."""
        logger.info("Worker 1: Synthesizing Blueprint, Architecture, Documentation & Viva...")
        prompt = UNIFIED_SPEC_PROMPT.format(
            domain=domain,
            topic=topic_clean,
            description=desc_clean,
            difficulty=difficulty,
            level=level,
            tech_stack=tech_stack
        )
        res = client.generate(prompt, system_prompt=PROJECT_GENERATOR_SYSTEM_PROMPT, temperature=temp, max_tokens=tokens)
        parsed = extract_json(res) or {}
        logger.info(f"Worker 1 Complete. Blueprint fields: {list(parsed.keys())}")
        return parsed

    def synthesize_codebase():
        """Generates the functional production code files concurrently."""
        logger.info("Worker 2: Synthesizing Working Codebase Files...")
        if "flask" in tech_stack.lower():
            prompt = FLASK_CODEBASE_PROMPT.format(
                title=topic_clean,
                overview=desc_clean,
                difficulty=difficulty,
                level=level
            )
        else:
            prompt = FAST_CODEBASE_PROMPT.format(
                title=topic_clean,
                domain=domain,
                tech_stack=tech_stack,
                difficulty=difficulty,
                level=level,
                overview=desc_clean
            )
        res = client.generate(prompt, system_prompt=PROJECT_GENERATOR_SYSTEM_PROMPT, temperature=temp, max_tokens=tokens)
        parsed = extract_json(res) or {}
        files = parsed.get("files", [])
        if isinstance(files, list) and len(files) > 0:
            valid_files = [
                f for f in files
                if isinstance(f, dict) and f.get("filename") and f.get("content") and len(str(f.get("content", ""))) > 15
            ]
            if valid_files:
                logger.info(f"Worker 2 Complete. Generated {len(valid_files)} valid code files.")
                return valid_files
        logger.warning("Worker 2: Using robust fallback codebase.")
        return _fallback_files(topic_clean, tech_stack, desc_clean)

    # Execute both workers concurrently
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        future_blueprint = executor.submit(synthesize_blueprint)
        future_code = executor.submit(synthesize_codebase)

        try:
            blueprint_data = future_blueprint.result(timeout=50)
        except Exception as e:
            logger.error(f"Blueprint synthesis timed out or failed: {e}")
            blueprint_data = {}

        try:
            code_files = future_code.result(timeout=50)
        except Exception as e:
            logger.error(f"Code synthesis timed out or failed: {e}")
            code_files = _fallback_files(topic_clean, tech_stack, desc_clean)

    title = blueprint_data.get("title") or topic_clean
    overview = blueprint_data.get("overview") or desc_clean
    features_list = blueprint_data.get("features", [])

    return {
        "title":                    title,
        "abstract":                 blueprint_data.get("abstract", overview),
        "problem_statement":        blueprint_data.get("problem_statement", f"Solves core domain challenges in {domain} using modern {tech_stack} technologies."),
        "architecture_description": blueprint_data.get("system_architecture", "Full-Stack Modular Architecture with secure API boundaries and scalable database design."),
        "tech_stack_details":       blueprint_data.get("tech_stack_details", {
            "frontend": "Modern UI Interface",
            "backend": tech_stack,
            "database": "Relational/Document Store",
            "other": "REST API, JWT Authentication"
        }),
        "files":                    code_files,
        "viva_questions":           blueprint_data.get("viva_questions", [
            {"question": "What is the primary objective of your system?", "answer": f"The primary objective is to implement a robust {topic_clean} solving real-world {domain} challenges."},
            {"question": "What technology stack did you use and why?", "answer": f"We chose {tech_stack} for its performance, modularity, and scalability."},
            {"question": "How did you design the database and handle relationships?", "answer": "The schema uses normalized tables with foreign key constraints and indexing for fast query performance."},
            {"question": "What security measures are implemented?", "answer": "Authentication with JWT, input sanitization, error handling, and secure endpoints."}
        ]),
        "tags":                     [domain, difficulty],
        "estimated_completion_time": "2-3 Weeks",
        "domain":                   domain,
        "difficulty":               difficulty,
        "features":                 features_list,
        "database_design":          blueprint_data.get("database_design", "Normalized schema with primary and foreign key constraints."),
        "logic_flow":               blueprint_data.get("logic_flow", "User request -> API Controller -> Business Logic Services -> Database -> Response."),
        "security_measures":        blueprint_data.get("security_measures", "JWT auth, input validation, role checks, and encrypted communication."),
        "literature_survey":        blueprint_data.get("literature_survey", "Analyzes contemporary architectural patterns and modern web/ML pipelines."),
        "methodology":              blueprint_data.get("methodology", "1. Requirements Analysis, 2. Architectural Design, 3. Implementation, 4. Testing, 5. Deployment."),
    }
