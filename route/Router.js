import express, {request, response} from "express";
import Information from "../models/Information";
import { faker } from '@faker-js/faker';



const router = express.Router();

 route.get('/', async (request,response)=>{

     let information = await Information.find()

     res.json(information)
 })

route.get('/id', async (request,response)=>{
    try {
        let info = await Information.findOne({'_id': req.params.id})
        res.json(info)
    } catch (e){
        res.json({
            message: 'Couldnt found info'
        })
    }
})

route.post('/', async (req,res)=>{

})

export default route

