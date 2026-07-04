import { Router } from 'express'
import { analyticsController } from '../controllers/analytics.controller'

const router = Router()

router.get('/summary', analyticsController.getSummary)
router.get('/by-department', analyticsController.getByDepartment)
router.get('/by-country', analyticsController.getByCountry)
router.get('/distribution', analyticsController.getDistribution)
router.get('/top-paid', analyticsController.getTopPaid)

export default router