import { Router } from "express";
import auth from "../middleware/authMiddleware.js"; 
import { createCheckoutSession, verifyCheckoutSession } from "../controllers/paymentController.js";

const router = Router();

router.post('/create-checkout-session', auth, createCheckoutSession)

router.get('/verify-session', auth, verifyCheckoutSession)

export default router