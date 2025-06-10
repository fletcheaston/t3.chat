from ninja import Router

from . import create, list, update

router = Router()


router.add_router("/list", list.router, tags=["tags"])
router.add_router("/create", create.router, tags=["tags"])
router.add_router("/update", update.router, tags=["tags"])
