from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import os

from app.database import get_db
from app.models.user import User
from app.models.project import Project, ProjectContent
from app.models.activity import Activity
from app.models.settings import PlatformSettings
from app.auth.dependencies import get_current_user

router = APIRouter(tags=["Admin Control Panel"])

_SUPER_ADMIN_EMAIL = os.environ.get("SUPER_ADMIN_EMAIL", "").strip().lower()

def check_super_admin(user: User):
    """Strictly enforces that only the super admin email can access these controls."""
    if not (user.email.lower() == _SUPER_ADMIN_EMAIL):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Mission Critical Access Denied. Super Admin clearance required."
        )

# ── Analytics & Stats ──────────────────────────────────────────────────────────

@router.get("/stats")
async def get_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_super_admin(current_user)
    
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    total_projects = db.query(Project).count()
    total_viva_questions = db.query(ProjectContent).filter(ProjectContent.type == "viva").count()
    
    # Calculate growth (simple simulation for now: projects in last 7 days)
    last_week = datetime.utcnow() - timedelta(days=7)
    recent_projects = db.query(Project).filter(Project.created_at >= last_week).count()
    growth_pct = (recent_projects / (total_projects or 1)) * 100
    
    # Distribution data for charts
    difficulty_stats = db.query(Project.difficulty, func.count(Project.id)).group_by(Project.difficulty).all()
    domain_stats = db.query(Project.domain, func.count(Project.id)).group_by(Project.domain).all()
    
    return {
        "counters": {
            "total_users": total_users,
            "active_users": active_users,
            "total_projects": total_projects,
            "total_viva_questions": total_viva_questions,
            "growth_pct": round(growth_pct, 1)
        },
        "charts": {
            "difficulty": [{"name": d or "Unknown", "value": c} for d, c in difficulty_stats],
            "domains": [{"name": d or "Miscellaneous", "value": c} for d, c in domain_stats]
        }
    }

# ── User Management (ACCOUNTS) ────────────────────────────────────────────────

@router.get("/users")
async def list_users(
    search: Optional[str] = None,
    role: Optional[str] = None,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_super_admin(current_user)
    query = db.query(User)
    
    if search:
        query = query.filter(or_(User.email.contains(search), User.name.contains(search)))
    if role:
        query = query.filter(User.role == role)
    if status:
        is_active = status == "active"
        query = query.filter(User.is_active == is_active)
        
    users = query.all()
    result = []
    for u in users:
        # Get project count for each user
        p_count = db.query(Project).filter(Project.user_id == u.id).count()
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "status": "active" if u.is_active else "suspended",
            "signup_date": u.created_at,
            "last_login": u.last_login,
            "project_count": p_count
        })
    return result

@router.post("/users/{user_id}/status")
async def update_user_status(
    user_id: int,
    status_data: Dict[str, str],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_super_admin(current_user)
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(404, "User not found")
    if user.email == _SUPER_ADMIN_EMAIL: raise HTTPException(400, "Cannot suspend super admin")
    
    new_status = status_data.get("status")
    user.is_active = (new_status == "active")
    db.commit()
    return {"message": f"User {new_status}"}

@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    role_data: Dict[str, str],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_super_admin(current_user)
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(404, "User not found")
    
    new_role = role_data.get("role")
    if new_role not in ["admin", "user", "moderator"]: raise HTTPException(400, "Invalid role")
    user.role = new_role
    user.is_admin = (new_role == "admin")
    db.commit()
    return {"message": f"Role updated to {new_role}"}

# ── Project Management ────────────────────────────────────────────────────────

@router.get("/projects")
async def list_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_super_admin(current_user)
    projects = (
        db.query(Project, User.email.label("owner_email"))
        .join(User, Project.user_id == User.id)
        .all()
    )
    return [{
        "id": p.Project.id,
        "name": p.Project.title,
        "owner_email": p.owner_email,
        "description": p.Project.description,
        "status": p.Project.status,
        "progress": p.Project.progress,
        "created_at": p.Project.created_at,
        "deadline": p.Project.deadline
    } for p in projects]

@router.patch("/projects/{project_id}")
async def update_project(
    project_id: int,
    data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_super_admin(current_user)
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project: raise HTTPException(404, "Project not found")
    
    for key, value in data.items():
        if hasattr(project, key):
            setattr(project, key, value)
    db.commit()
    return {"message": "Project updated"}

@router.delete("/projects/{project_id}")
async def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_super_admin(current_user)
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project: raise HTTPException(404, "Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}

# ── Reports & PPTs ────────────────────────────────────────────────────────────

@router.get("/contents")
async def list_contents(
    content_type: str, # "report" or "presentation"
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_super_admin(current_user)
    contents = (
        db.query(ProjectContent, Project.title.label("project_title"), User.email.label("user_email"))
        .join(Project, ProjectContent.project_id == Project.id)
        .join(User, Project.user_id == User.id)
        .filter(ProjectContent.type == content_type)
        .all()
    )
    return [{
        "id": c.ProjectContent.id,
        "project_title": c.project_title,
        "user_email": c.user_email,
        "created_at": c.ProjectContent.created_at,
        "type": c.ProjectContent.type
    } for c in contents]

# ── AI Config ─────────────────────────────────────────────────────────────────

@router.get("/config")
async def get_ai_config(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_super_admin(current_user)
    config = db.query(PlatformSettings).filter(PlatformSettings.setting_key == "AI_CONFIG").first()
    if not config:
        return {
            "model": os.getenv("OLLAMA_MODEL", "llama3"),
            "provider": "ollama",
            "api_key": "Local (Ollama)",
            "usage_limit": "Unlimited",
            "current_usage": 0
        }
    return config.setting_value

@router.post("/config")
async def update_ai_config(
    data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_super_admin(current_user)
    config = db.query(PlatformSettings).filter(PlatformSettings.setting_key == "AI_CONFIG").first()
    if not config:
        config = PlatformSettings(setting_key="AI_CONFIG", setting_value=data)
        db.add(config)
    else:
        config.setting_value = data
    db.commit()
    return {"message": "Config updated"}
