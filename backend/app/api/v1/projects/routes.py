from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.services.project_service import ProjectService
from app.schemas.project import ProjectGenerateRequest, ProjectFullResponse, ProjectGenerationResponse

router = APIRouter()

@router.get("/", response_model=List[ProjectFullResponse])
def list_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all projects for the authenticated user."""
    return ProjectService.list_projects(db, current_user.id)

@router.post("/", response_model=ProjectGenerationResponse, status_code=status.HTTP_201_CREATED)
def generate_project(
    payload: ProjectGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a new project using AI."""
    db_project = ProjectService.create_project_skeleton(db, current_user.id, payload)
    db_contents = ProjectService.run_ai_pipeline(db, db_project)
    return {
        "project": db_project,
        "contents": db_contents
    }

@router.get("/stats")
def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get usage statistics for the authenticated user."""
    return ProjectService.get_user_stats(db, current_user.id)

@router.get("/{project_id}")
def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get full details of a specific project."""
    project = ProjectService.get_project_full(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a project."""
    success = ProjectService.delete_project(db, project_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}
