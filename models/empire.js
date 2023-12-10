import mongoose from "mongoose";


const Schema = mongoose.Schema;


const empireSchema = new Schema(
    {
        civilization: String,
        name: String,
        specialty: String,
        army: String,
        difficulty: String,


}
)

export default  mongoose.model('Empire', empireSchema)
