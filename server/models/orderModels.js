import { Schema, model } from "mongoose";

const Order = new Schema({
    typeProject: {type: String, default: 'UNDEFINED'},
    name: {type: String},
    phone: {type: String},
    email: {type: String},
    budjet: {type: String, default: 'UNDEFINED'},
    comment: {type: String},
    status: {type: String, default: 'Нове замовлення'}
}, {timestamps: true})

export default model('Order', Order)