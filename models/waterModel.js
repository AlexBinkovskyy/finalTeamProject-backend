import { Schema, model } from 'mongoose'

const waterSchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	waterAmount: [
		{
			date: { type: String, required: true },
			dailyCount: [
				{
					amount: { type: Number, required: true },
					time: { type: String, required: true },
				},
			],
		},
	],
})

export const Water = model('water', waterSchema)
