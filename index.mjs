// import mongoose from 'mongoose';
import express, {Router} from "express";
import 'dotenv/config';

// mongoose.connect(process.env.DB_CONNECTION + process.env.DB_NAME);


const app = express();


app.get('/', (req, res) => {
    res.send('hello world')
});


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/information', Router)


app.listen(process.env.PORT,()=>{
    console.log('server staat aan');
});