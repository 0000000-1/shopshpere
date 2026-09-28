// `userRoutes.js` → Login, signup, profile
import { Router } from 'express'
import {login, signup, profile, getCart, updateCart, deleteCart} from '../controllers/userController.js'
import auth from '../middleware/authMiddleware.js'
import checkAdmin from '../middleware/adminMiddleware.js'

const router = Router()
// public auth
router.post('/login', login)
router.post('/signup', signup)
//user profile
router.get('/profile', auth, profile)
// cart check
router.get('/cart', auth, getCart)
router.put('/cart/add', auth, updateCart) // this add and update together 
router.delete('/cart/delete/:id', auth, deleteCart )

//admin check
// router.put('/:id', auth, checkAdmin, profile) // error need fix

export default router
