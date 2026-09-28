from fastapi import APIRouter
from .projects import routes as projects
from .organizations import routes as organizations
from .subscriptions import routes as subscriptions
from .webhooks import routes as webhooks
from .api_keys import routes as api_keys
from .analytics import routes as analytics
from .templates import routes as templates

router = APIRouter()

router.include_router(projects.router, prefix="/projects", tags=["Projects"])
router.include_router(organizations.router, prefix="/organizations", tags=["Organizations"])
router.include_router(subscriptions.router, prefix="/subscriptions", tags=["Subscriptions"])
router.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])
router.include_router(api_keys.router, prefix="/api_keys", tags=["API Keys"])
router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
router.include_router(templates.router, prefix="/templates", tags=["Templates"])
