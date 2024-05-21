import express from 'express'
import {
  addWater,
  deleteWater,
  getWaterByDay,
  getWaterByMonth,
  updateWater,
} from '../controllers/waterController.js'
import { protect } from '../midleWares/protect.js'
import validateBody from '../helpers/validateBody.js'
import {
  addWaterDataSchema,
  updateWaterDataSchema,
  validateParamsDateDay,
  validateParamsDateMounth,
} from '../models/validationSchemas/waterValidationSchema.js'
import validateParams from '../helpers/validateParams.js'
import { checkId } from '../midleWares/checkId.js'
// import { asyncWrapper } from '../midleWares/asyncWrapper';
// import { checkToken } from '../midleWares/checkToken';

const waterRouter = express.Router()

waterRouter.post('/add', validateBody(addWaterDataSchema), protect, addWater)

waterRouter.put(
  '/edit/:id',
  validateBody(updateWaterDataSchema),
  checkId,
  protect,
  updateWater
)
waterRouter.delete('/delete/:id', checkId, protect, deleteWater)
waterRouter.get(
  '/dayconsumption/:date',
  validateParams(validateParamsDateDay),
  protect,
  getWaterByDay
)
waterRouter.get(
  '/monthconsumption/:date',
  validateParams(validateParamsDateMounth),
  protect,
  getWaterByMonth
)

export default waterRouter
