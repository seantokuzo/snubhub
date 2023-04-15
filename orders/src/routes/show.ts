import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth
} from '@snubhub/common'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Order } from '../models/order'

const router = express.Router()

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      throw new BadRequestError('Invalid orderId')
    }

    const order = await Order.findById(req.params.orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    res.send(order)
  }
)

export { router as showOrderRouter }
