from fastapi import APIRouter
from app.api.admin import dashboard

router = APIRouter()
router.include_router(dashboard.router)
