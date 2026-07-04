import { Router } from 'express'
import { lookupController } from '../controllers/lookup.controller'

const router = Router()

router.get('/departments', lookupController.getDepartments)
router.get('/countries', lookupController.getCountries)

export default router