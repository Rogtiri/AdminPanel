import { Schema, model } from "mongoose";

const Worker = new Schema({
    name: {type: String},
    surname: {type: String},
    pobatkovi: {type: String},
    phone: {type: String},
    typeWorker: {type: String},
    nameWorkType: {type: String},
    stavka: {type: String},
    city: {type: String},
    status: {type: String, default: 'Робочий'},
}, {timestamps: true})

export default model('Worker', Worker)