import express, {request, response} from "express";
import {faker, tr} from '@faker-js/faker';
import Empire from "../models/empire.js";
const routes = express.Router();



    // get all data
    routes.get('/', async (req,res) =>{

        try {
            const empires = await Empire.find({});
            res.json(empires);
            console.log('working');

        } catch (err){
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


    // get data by id
    routes.get('/:id', async (req, res) => {
        try {
            const { id } = req.params; // Fix the typo here
            const empires = await Empire.findById(id);
            res.json(empires);
            console.log('working');
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


// create new with faker
    routes.post('/', async (req,res) =>{

        try {
            const empires = await Empire.create({
                civilization: faker.lorem.word({length:{min:3 , max:10}}),
                specialty: faker.lorem.word({length:{min:3 , max:10}}),
                army: faker.lorem.word({length:{min:3 , max:10}}),
                difficulty: faker.lorem.word({length:{min:3 , max:10}})

            });
            res.json(empires);
            console.log('seeder works');
        } catch (err){
            console.log(err);
            res.status(500).json({error: 'Internal server error'})
        }
    });

// update empire

    routes.put('/:id', async (req, res) => {
        try {
            if (
                !req.body.civilization ||
                !req.body.specialty ||
                !req.body.army ||
                !req.body.difficulty
            ) {
                return res.status(400).send({
                    message: 'Send all required fields: civilization, specialty, army, difficulty'
                });
            }

            const { id } = req.params;
            const result = await Empire.findByIdAndUpdate(id, req.body);

            if (!result) {
                return res.status(404).json({ message: 'Empire not found' });
            }

            res.json(result); // Send the updated document as the response
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

// Delete empire
    routes.delete('/:id', async (req,res) =>{
        try {
            const { id } = req.params;
            const result = await Empire.findByIdAndDelete(id);

            if (!result){
                return res.status(404).json({ message: 'Empire not found' });
            } else{
                return res.status(200).send({ message: 'Empire is deleted !' });
            }

        }catch (err){
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });



export default routes