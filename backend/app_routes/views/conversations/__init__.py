from ninja import Router

from . import create, list, update

router = Router()


router.add_router("", list.router, tags=["conversations"])
router.add_router("", create.router, tags=["conversations"])
router.add_router("", update.router, tags=["conversations"])
