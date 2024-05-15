import HttpErrors from '../helpers/HttpError.js'
import { asyncWrapper } from '../helpers/asyncWrapper.js'
import { Water } from '../models/waterModel.js'

export const addWater = asyncWrapper(async (req, res, next) => {
  const waterData = req.body
  const { date, time, amount } = waterData
  const userId = req.user._id
  let isNewDate = false

  let waterNote = await Water.findOne({ owner: userId })

  if (!waterNote) {
    waterNote = new Water({
      owner: userId,
      waterAmount: [],
    })
  }

  let waterAmountItem = waterNote.waterAmount.find(water => water.date === date)

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

  addWaterStatsToObj(waterAmountItem)

  if (isNewDate) {
    waterNote.waterAmount.push(waterAmountItem)
  }

  await Water.create(waterNote)

  res.status(201).json(waterAmountItem)
})

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

        addWaterStatsToObj(waterAmountItem)

        await findWater.save()
        res.status(200).json(waterAmountItem)
      }
    }
  }
  return next(HttpErrors(404))
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

      addWaterStatsToObj(waterAmountItem)

      await findWater.save()
      res.status(200).json(waterAmountItem)
    }
  }
  return next(HttpErrors(404))
})

export const getWaterByDay = asyncWrapper(async (req, res, next) => {
  const ownerId = req.user._id
  const { date } = req.params

  const findWater = await Water.findOne({ owner: ownerId })
  if (!findWater) {
    return next(HttpErrors(404))
  }

  const waterArr = findWater.waterAmount.find(item => item.date === date)
  if (!waterArr) {
    return next(HttpErrors(404))
  }
  res.status(200).json(waterArr)
})

export const getWaterByMonth = asyncWrapper(async (req, res, next) => {
  const ownerId = req.user._id
  const { date } = req.params
  const [month, year] = date.split('.')

  const findWater = await Water.findOne({ owner: ownerId })

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

function addWaterStatsToObj(waterAmountItem) {
  waterAmountItem.totalWater = calculateDailyTotalAmount(
    waterAmountItem.dailyCount
  )
  waterAmountItem.waterRecordsAmount = getDailyCountLength(
    waterAmountItem.dailyCount
  )
}

function calculateDailyTotalAmount(dailyCount) {
  return dailyCount.reduce((total, el) => {
    return total + el.amount
  }, 0)
}
function getDailyCountLength(dailyCount) {
  return dailyCount.length
}
