import os
from .llm_client import LLMClient
from ..prompts.system_prompts import VIVA_ASSISTANT_SYSTEM_PROMPT, PLATFORM_ASSISTANT_SYSTEM_PROMPT

def get_viva_response(api_key, provider, history, project_data):
    """
    Generates a response for the assistant based on chat history and optional project context.
    """
    client = LLMClient(api_key=api_key, provider=provider)
    
    # Decide which system prompt to use
    system_prompt = VIVA_ASSISTANT_SYSTEM_PROMPT if project_data else PLATFORM_ASSISTANT_SYSTEM_PROMPT
    
    # Construct context from project data
    context = ""
    if project_data:
        context = f"""
        Student Project Context:
        Title: {project_data.get('title')}
        Abstract: {project_data.get('abstract')}
        Architecture: {project_data.get('architecture_description')}
        Tech Stack: {project_data.get('tech_stack_details')}
        """
    
    # Format messages for LLM
    # Simplification: We'll just append the last question with context to a wrapper if simple generation
    conversation_str = ""
    for msg in history:
        role = msg.get("role", "user").upper()
        content = msg.get("content", "")
        conversation_str += f"{role}: {content}\n"
        
    final_prompt = f"{context}\n\nConversation History:\n{conversation_str}\n\nAI ASSISTANT (You):"
    
    return client.generate(final_prompt, system_prompt=system_prompt)
