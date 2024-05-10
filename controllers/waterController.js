import HttpErrors from '../helpers/HttpError.js'
import { asyncWrapper } from '../helpers/asyncWrapper.js'
import { Water } from '../models/waterModel.js'
import { v4 } from 'uuid'

/**
 * Приклад вхідних даних
 * {
 * 	date: '01-01-2024',
 * 	time: '10:00',
 * 	ammount: 250
 * }
 */
export const addWater = asyncWrapper(async (req, res, next) => {
	console.log('========start=========')
	const waterData = req.body
	const { date, time, amount } = waterData
	const userId = req.user._id
	let isNewDate = false

	//Отримую весь запис
	let waterNote = await Water.findOne({ owner: userId })

	//Якщо такого нема то створюю початкову структуру
	if (!waterNote) {
		waterNote = new Water({
			owner: userId,
			waterAmount: [],
		})
	}

	//Беремо статистику за потрібний день
	let waterAmountItem = waterNote.waterAmount.find(water => water.date === date)

	//Якщо на цій даті немає інформації, то створюємо пустий шаблон
	if (!waterAmountItem) {
		waterAmountItem = {
			date,
			dailyCount: [],
		}
		isNewDate = true
	}

	waterAmountItem.dailyCount.push({
		amount,
		time,
	})

	if (isNewDate) {
		// Якщо це нова дата, додайте новий об'єкт waterAmountItem
		waterNote.waterAmount.push(waterAmountItem)
	}

	waterNote = await Water.create(waterNote)

	res.status(201).json(waterNote)
})

/**
 * Приклад вхідних даних
 * {
 * 	time: '10:00',
 * 	ammount: 250
 * }
 */
export const updateWater = asyncWrapper(async (req, res, next) => {
	const ownerId = req.user._id
	const { id } = req.params
	const newData = req.body

	const findWater = await Water.findOne({ owner: ownerId })

	if (!findWater) {
		return next(HttpErrors(404))
	}

	for (const waterAmountItem of findWater.waterAmount) {
		for (const dailyCountItem of waterAmountItem.dailyCount) {
			if (dailyCountItem._id.toString() === id) {
				const mergedData = {
					...dailyCountItem.toObject(),
					...newData,
				}

				delete mergedData._id
				Object.assign(dailyCountItem, mergedData)
				break
			}
		}
	}

	await findWater.save()
	res.status(200).json(findWater)
})

export const deleteWater = asyncWrapper(async (req, res, next) => {
	const ownerId = req.user._id
	const { id } = req.params

	const findWater = await Water.findOne({ owner: ownerId })

	if (!findWater) {
		return next(HttpErrors(404))
	}

	for (const waterAmountItem of findWater.waterAmount) {
		const dailyCountIndex = waterAmountItem.dailyCount.findIndex(
			dailyCountItem => dailyCountItem._id.toString() === id
		)

		if (dailyCountIndex !== -1) {
			waterAmountItem.dailyCount.splice(dailyCountIndex, 1)
			break
		}
	}

	await findWater.save()
	res.status(200).json(findWater)
})

export const getWaterByDay = asyncWrapper(async (req, res, next) => {
	const ownerId = req.user._id
	const { date } = req.params
	// const [day, mounth, year] = date.split('.')

	const findWater = await Water.findOne({ owner: ownerId })
	if (!findWater) {
		return next(HttpErrors(404))
	}

	const waterArr = findWater.waterAmount.find(item => item.date === date)
	if (!waterArr) {
		console.log(waterArr)
		return next(HttpErrors(404))
	}
	res.status(200).json(waterArr)
})

export const getWaterByMonth = asyncWrapper(async (req, res, next) => {
	const ownerId = req.user._id
	const { date } = req.params
	const [month, year] = date.split('.')

	const findWater = await Water.findOne({ owner: ownerId })

	console.log(findWater)

	if (!findWater) {
		return next(HttpErrors(404))
	}

	const waterArr = findWater.waterAmount.filter(item => {
		const [d, m, y] = item.date.split('.')
		return m === month && y === year
	})

	if (!waterArr) {
		return next(HttpErrors(404))
	}

	res.status(200).json(waterArr)
})