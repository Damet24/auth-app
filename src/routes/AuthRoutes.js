import express from 'express'
import container from '../ioc.js'
import {validate, AuthValidationSchema } from '../validation/index.js'

const authController = container.get('auth-controller')
const router = express.Router()

router.post('/signup', validate(AuthValidationSchema), authController.signup.bind(authController))

export default router
