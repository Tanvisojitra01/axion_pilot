from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.project import ProjectGenerateRequest, ProjectGenerationResponse
from app.services.project_service import ProjectService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/generate", response_model=ProjectGenerationResponse, status_code=status.HTTP_201_CREATED)
def generate_project_api(
    payload: ProjectGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    POST /project/generate
    
    1. Create project skeleton in database.
    2. Run mock AI generation pipeline.
    3. Store each generated section in ProjectContent.
    4. Return structured response with all data.
    """
    try:
        # Step 1: Create Project Skeleton
        db_project = ProjectService.create_project_skeleton(
            db=db, 
            user_id=current_user.id, 
            request=payload
        )
        
        # Step 2: Run AI Generation Pipeline
        # This stores content for each section: idea, architecture, modules, code, report, presentation, viva
        db_contents = ProjectService.run_ai_pipeline(db, db_project)
        
        # Step 3: Format and return structured response
        return {
            "project": db_project,
            "contents": db_contents
        }
        
    except Exception as e:
        logger.error(f"Failed to generate project: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Project generation failed: {str(e)}"
        )
