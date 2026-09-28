"""
ollama_generator.py

This file handles communication with Ollama (the local AI).
Think of it as a translator:
- AXIONX Backend sends it a prompt
- It sends the prompt to Ollama
- Ollama generates code
- It sends code back to AXIONX
"""

import requests
import json
import os
import logging

logger = logging.getLogger(__name__)

# THIS IS WHERE OLLAMA IS RUNNING
# If Ollama is on your computer: http://localhost:11434
# If Ollama is on a server: http://server-ip:11434
OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/") + "/api/generate"
MODEL = os.getenv("OLLAMA_MODEL", "codellama:7b")  # The AI model we're using

def generate_code(prompt, model=None, url=None):
    """
    Send a prompt to Ollama and get code back
    """
    target_model = model or MODEL
    target_url = url or OLLAMA_URL
    try:
        # Send request to Ollama
        response = requests.post(
            target_url,
            json={
                "model": target_model,
                "prompt": prompt,
                "stream": False,
                "temperature": 0.7,
            },
            timeout=int(os.getenv("OLLAMA_TIMEOUT", "180"))
        )
        
        # Check if request was successful
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "")
        else:
            return f"Error: Ollama returned status code {response.status_code}"
            
    except requests.exceptions.ConnectionError:
        return "Error: Cannot connect to Ollama. Make sure 'ollama serve' is running."
    except requests.exceptions.Timeout:
        return "Error: Generation took too long (timeout)."
    except Exception as e:
        return f"Error: {str(e)}"


def generate_documentation(code, project_name):
    """
    Generate documentation from the code
    """
    prompt = f"""
    Generate professional, beginner-friendly documentation for this code project.
    
    Project Name: {project_name}
    
    Code:
    {code}
    
    Include:
    1. What does this project do? (1-2 sentences)
    2. How to set it up? (step-by-step)
    3. How to run it? (commands to type)
    4. What are the main features? (bulleted list)
    5. Troubleshooting tips (common problems and solutions)
    
    Use simple language. Assume the reader is a student.
    """
    return generate_code(prompt)


def generate_viva_questions(code, project_description):
    """
    Generate interview questions based on the code
    """
    prompt = f"""
    Generate 10 realistic interview questions for a student who created this project.
    
    Project Description: {project_description}
    
    Code:
    {code}
    
    Format each question like this:
    Q1: [Simple question about the code]
    A1: [Clear answer a student could give]
    Difficulty: Beginner
    
    Q2: [Slightly harder question]
    A2: [Answer]
    Difficulty: Intermediate
    
    ... and so on
    
    Rules:
    - Only ask about code they actually wrote
    - Start with basics, progress to advanced
    - Include "how would you..." scenario questions
    - Make answers 2-3 sentences max
    - Answers should match student skill level
    """
    return generate_code(prompt)

class OllamaGenerator:
    """
    Compatibility class for the LLMClient pipeline.
    """
    def __init__(self, model=None, base_url=None):
        self.model = model or os.getenv("OLLAMA_MODEL", "llama3")
        self.base_url = (base_url or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")).rstrip("/")
        self.generate_url = f"{self.base_url}/api/generate"

    def generate(self, prompt, system=None, options=None):
        # If a custom model is requested, we temp override or use the logic
        full_prompt = f"System: {system}\n\nUser: {prompt}" if system else prompt
        return generate_code(full_prompt, model=self.model, url=self.generate_url)

    async def generate_async(self, prompt, system=None, options=None):
        # In a real async environment, we should use httpx, 
        # but for compatibility we'll just call the sync version
        return self.generate(prompt, system, options)
