 import mongoose from "mongoose";

 const Schema = mongoose.Schema;



const informationSchema = new Schema({
    civilization: String,
    specialty: String,
    army: String,
    difficulty: Number,
    year: Number
})

const Information = mongoose.model('Information', informationSchema)


export default information;
