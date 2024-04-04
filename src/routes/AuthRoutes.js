import express from 'express'
import container from '../ioc.js'
import {validate, AuthValidationSchema } from '../validation/index.js'

/** @type {AuthController} */
const authController = container.get('auth-controller')
const router = express.Router()

router.post(
    '/signup',
    validate(AuthValidationSchema),
    authController.signup.bind(authController))
router.post(
    '/login',
    validate(AuthValidationSchema),
    authController.login.bind(authController))

export default router
