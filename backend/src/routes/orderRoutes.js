// `orderRoutes.js` → Place order, get orders
import { Router } from 'express'
import {getOrderById, getAllOrders, getMyOrders} from '../controllers/orderController.js'
import auth from '../middleware/authMiddleware.js'
import checkAdmin from '../middleware/adminMiddleware.js'

const router = Router()

// only admin - ADDED 'auth' here so we can filter orders by the logged-in user or admin
router.get('/', auth, checkAdmin, getAllOrders) 

// regular users 
router.get('/my-orders', auth, getMyOrders)

//  (regular user, viewing one order's detail)- This one was already perfect!
router.get('/:id', auth, getOrderById)


export default router