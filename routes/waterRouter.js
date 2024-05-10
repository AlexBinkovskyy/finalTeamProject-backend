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
// import { asyncWrapper } from '../midleWares/asyncWrapper';
// import { checkToken } from '../midleWares/checkToken';

const waterRouter = express.Router()

// waterRouter.use((checkToken))

waterRouter.patch('/', validateBody(addWaterDataSchema), protect, addWater)
waterRouter.put(
	'/:id',
	validateBody(updateWaterDataSchema),
	protect,
	updateWater
)
waterRouter.delete('/:id', protect, deleteWater)
waterRouter.get(
	'/daycosumption/:date',
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
