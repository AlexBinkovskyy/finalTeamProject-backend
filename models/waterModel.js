import { Schema, model } from "mongoose";

const waterSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    waterAmmount: {
        date: {type: String, required: true},
        dailyCount: [{
            ammount: { type: Number, required: true },
            time: { type: String, required: true },
            id: { type: String, required: true }}]
    }
})

export const Water = model('water', waterSchema)