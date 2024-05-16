import { Schema, model } from 'mongoose'

const waterSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Owner is a required field'],
  },
  waterAmount: [
    {
      date: {
        type: String,
        required: [true, 'Date is a required field'],
      },
      dailyCount: [
        {
          amount: {
            type: Number,
            required: [true, 'Amount of water is a required field'],
          },
          time: {
            type: String,
            required: [true, 'Time is a required field'],
          },
        },
      ],
      totalWater: {
        type: Number,
        default: 0,
        validate: {
          validator: function (value) {
            return value >= 0
          },
          message: 'Total water amount must be greater than or equal to zero',
        },
      },
      waterRecordsAmount: {
        type: Number,
        default: 0,
        validate: {
          validator: function (value) {
            return value >= 0
          },
          message:
            'Number of water records must be greater than or equal to zero',
        },
      },
    },
  ],
})

export const Water = model('water', waterSchema)
