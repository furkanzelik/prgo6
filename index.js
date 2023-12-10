import express from "express"
import mongoose from 'mongoose'
import Router from  './route/Router.js'
import 'dotenv/config'

mongoose.connect('mongodb://127.0.0.1:27017/AOE');




const app = express();

app.use(express.json());
app.use('/empires', Router);


app.get('/', (req, res) => {
    res.send('hello world')
});

app.listen(process.env.PORT,()=>{
    console.log('server staat aan');
});