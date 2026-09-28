// `productRoutes.js` → Get products, single product.
import { Router } from 'express'
import {getProducts, singleProduct, createProduct, updateProduct, deleteProduct} from '../controllers/productController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = Router()

router.get('/',getProducts)
router.get('/:id',singleProduct)
router.post('/', authMiddleware, adminMiddleware, createProduct)
router.put('/:id', authMiddleware, adminMiddleware, updateProduct)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct)

export default router