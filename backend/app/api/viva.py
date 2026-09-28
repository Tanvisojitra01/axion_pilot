from fastapi import APIRouter, HTTPException, Depends
from app.schemas.project import VivaRequest, VivaResponse
from app.core.generators.viva_gen import get_viva_response
from app.auth.dependencies import get_current_user_optional
from app.models.user import User

router = APIRouter()

@router.post("/ask", response_model=VivaResponse)
async def chat_viva(
    request: VivaRequest,
    current_user: User = Depends(get_current_user_optional)
):
    """Semi-Public chatbot. Allows conversation for anyone with an API key."""
    try:
        response_text = get_viva_response(
            api_key=request.api_key,
            provider=request.ai_provider,
            history=request.messages,
            project_data=request.project_data
        )
        return VivaResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
