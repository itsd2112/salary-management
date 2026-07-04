import { Router } from 'express'
import employeeRouter from './employee.routes';
import lookupRouter from './lookup.routes';

const router = Router()

router.use('/employees', employeeRouter)
router.use('/', lookupRouter)

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'development'
  })
})

export default router