PROJECT_STRUCTURE_PROMPT = """
[DEPRECATED] - Use the structured pipeline prompts below.
"""

# --- PIPELINE STAGE 1: IDEA EXPANSION ---
IDEA_EXPANSION_PROMPT = """You are a Product Manager. Expand the project idea below into a professional concept.

Domain: {domain}
Topic: {topic}
Description: {description}
Difficulty: {difficulty}
Level: {level}

IMPORTANT: Tailor the complexity, scope, and technical depth of the expanded project to precisely match the specified "Level" and "Difficulty".
- High Level/Difficulty: Enterprise-grade complexity, robust features, and advanced architecture.
- Low Level/Difficulty: Simple, straightforward, beginner-friendly application.

Return ONLY valid JSON with no extra text, no markdown fences, no explanation:
{{
    "expanded_title": "Full professional project title",
    "project_overview": "Detailed 200+ word overview of what this project does, its purpose, and real-world applications",
    "features": ["Feature 1 description", "Feature 2 description", "Feature 3 description", "Feature 4 description", "Feature 5 description", "Feature 6 description", "Feature 7 description", "Feature 8 description"],
    "target_audience": "Who will use this project and why",
    "usps": ["Unique selling point 1", "Unique selling point 2", "Unique selling point 3"]
}}"""

# --- PIPELINE STAGE 2: TECHNICAL ARCHITECTURE ---
ARCHITECTURE_PLANNING_PROMPT = """You are a Software Architect. Design the system architecture for this project.

Project: {title}
Overview: {overview}
Features: {features}
Tech Stack: {tech_stack}

Return ONLY valid JSON with no extra text, no markdown fences, no explanation:
{{
    "system_architecture": "Detailed 150+ word description of system components, modules and how they interact",
    "database_design": "Description of database tables, relationships, and key fields",
    "logic_flow": "Step-by-step description of how data flows from user request to response",
    "security_measures": "Security implementations: authentication, authorization, input validation, encryption",
    "tech_stack_details": {{
        "frontend": "Frontend technology and key libraries",
        "backend": "Backend framework and key libraries",
        "database": "Database technology and ORM used",
        "other": "Other tools, APIs, or services"
    }}
}}"""

# --- PIPELINE STAGE 3: CODE GENERATION (Generic) ---
CODEBASE_GENERATION_PROMPT = """You are a Senior Developer. Generate COMPLETE working source code for this project.

Architecture: {architecture}
Tech Stack: {tech_stack}
Difficulty: {difficulty}
Level: {level}

IMPORTANT: The complexity and quality of the generated code MUST reflect the specified "Difficulty" and "Level".
- High Level/Difficulty: Advanced design patterns, robust error handling, security best practices, and modular architecture.
- Low Level/Difficulty: Straightforward, simple to read, minimal viable code.

Generate these files with REAL, COMPLETE, WORKING code. No placeholders. Each file must have full content.

Return ONLY valid JSON with no extra text or markdown:
{{
    "files": [
        {{
            "filename": "app.py",
            "content": "# paste full working Python code here, not a placeholder"
        }},
        {{
            "filename": "config.py",
            "content": "# full config file"
        }},
        {{
            "filename": "requirements.txt",
            "content": "flask==2.3.3\nflask-sqlalchemy==3.1.1\npython-dotenv==1.0.0"
        }},
        {{
            "filename": "README.md",
            "content": "# Project Title\n\n## Setup\n1. pip install -r requirements.txt\n2. python app.py"
        }}
    ]
}}"""

# --- PIPELINE STAGE 3b: FLASK CODE GENERATION ---
FLASK_CODEBASE_PROMPT = """You are an expert Python Flask developer. Generate a COMPLETE working Flask web application.

Project Name: {title}
Description: {overview}
Difficulty: {difficulty}
Level: {level}

IMPORTANT: The complexity and quality of the generated code MUST reflect the specified "Difficulty" and "Level".
- High Level/Difficulty: Advanced design patterns, robust error handling, security best practices (e.g. CSRF, Validation), and a modular structure.
- Low Level/Difficulty: Monolithic, simple, and easy-to-understand codebase suitable for beginners.

Generate ALL of these files with complete, non-placeholder, working code:
- app.py: Main Flask app with all routes and logic
- models.py: SQLAlchemy database models
- config.py: App configuration class
- requirements.txt: All pip packages
- templates/base.html: Base HTML with Bootstrap 5 CDN
- templates/index.html: Home page listing all records
- static/css/style.css: Custom CSS styles
- README.md: Setup and run instructions

Return ONLY valid JSON with no extra text outside the JSON:
{{
    "files": [
        {{
            "filename": "app.py",
            "content": "from flask import Flask, render_template, request, redirect, url_for\nfrom flask_sqlalchemy import SQLAlchemy\nfrom config import Config\n\napp = Flask(__name__)\napp.config.from_object(Config)\ndb = SQLAlchemy(app)\n\nfrom routes import *\n\nif __name__ == '__main__':\n    with app.app_context():\n        db.create_all()\n    app.run(debug=True)"
        }},
        {{
            "filename": "requirements.txt",
            "content": "flask==2.3.3\nflask-sqlalchemy==3.1.1\npython-dotenv==1.0.0"
        }},
        {{
            "filename": "README.md",
            "content": "# {title}\n\n## Description\n{overview}\n\n## Setup\n1. pip install -r requirements.txt\n2. python app.py\n3. Open http://localhost:5000"
        }}
    ]
}}"""

# --- PIPELINE STAGE 4: DOCUMENTATION ---
DOCUMENTATION_PROMPT = """You are an academic documentation expert. Write content for a project report.

Project Overview: {concept}
System Architecture: {architecture}

Return ONLY valid JSON with no extra text outside the JSON:
{{
    "abstract": "A professional 250-300 word abstract describing the project objectives, methodology, and expected outcomes suitable for academic submission",
    "problem_statement": "A 150+ word problem statement explaining the need this project addresses, current limitations, and how this project solves them",
    "literature_survey": "Review of 3 related technologies or papers. For each: name, relevance to project, and limitation that this project improves upon",
    "methodology": "5-step methodology: 1. Requirements Analysis 2. System Design 3. Implementation 4. Testing 5. Deployment - with a sentence about each step"
}}"""

# --- PIPELINE STAGE 5: VIVA PREP ---
VIVA_PREP_PROMPT = """You are a college examiner preparing viva questions. Generate 10 questions and detailed answers.

Project: {title}
Architecture: {architecture}
Code Summary: {code_summary}

Return ONLY valid JSON with no extra text outside the JSON:
{{
    "viva_questions": [
        {{"question": "What is the main objective of your project?", "answer": "The main objective is to..."}},
        {{"question": "What technology stack did you use and why did you choose it?", "answer": "We used..."}},
        {{"question": "Explain your database schema and the relationships between tables.", "answer": "The database has..."}},
        {{"question": "How did you implement user authentication and what security measures did you take?", "answer": "We implemented..."}},
        {{"question": "What were the major challenges you faced and how did you overcome them?", "answer": "The major challenges were..."}},
        {{"question": "Explain the complete flow of data from when a user submits a form to the database.", "answer": "When a user submits..."}},
        {{"question": "How would you scale this application to support 10,000 users?", "answer": "To scale the application..."}},
        {{"question": "What testing strategies did you use to validate the application?", "answer": "We tested using..."}},
        {{"question": "If you could add one more feature, what would it be and why?", "answer": "I would add..."}},
        {{"question": "How does your system handle errors, exceptions, and invalid user inputs?", "answer": "The system handles errors by..."}}
    ]
}}"""
