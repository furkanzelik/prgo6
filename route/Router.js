import express, {request, response} from "express";
import {faker, tr, ur} from '@faker-js/faker';
import Empire from "../models/empire.js";
// import * as url from "url";
const routes = express.Router();

routes.use(express.json());
routes.use(express.urlencoded());


routes.use((req, res, next) => {
    const acceptedTypes = req.accepts(['json', 'html']);

    if (!acceptedTypes) {
        res.sendStatus(400);
        return;
    }
    res.locals.acceptedTypes = acceptedTypes;
    next();
})

    routes.options('/', function (req, res, next) {
        res.header('Allow', 'GET,POST,OPTIONS');
        res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Accept, Authorization, Origin');
        res.header('Access-Control-Allow-Origin', '*');   // globaal plaatsen

        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    });

    routes.options('/:id', function (req, res, next) {
        res.header('Allow', 'GET,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Accept, Authorization, Origin');
        res.header('Access-Control-Allow-Origin', '*');   // globaal plaatsen

        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    })



    // get all data
    routes.get('/', async (req, res) => {

        const acceptType = req.accepts('json');

        if (!acceptType) {
            res.status(406).json({message: 'not agreed'});
            return;
        }

        const url = `${req.protocol}://${req.get('host')}/empires`;

        try {

            const empires = await Empire.find({});

            let items = empires.map((empire) => {
                const empireObjects = empire.toObject();
                return {
                    ...empireObjects,
                    _links: {
                        self: {href: `${url}/${empire._id}`},
                        collection: {href: url}
                    },
                }
            });
            console.log('working');
            const response = {
                items: items,
                _links: {
                    self: {href: `${req.protocol}://${req.get('host')}/empires/`},
                },
                pagination: {
                    temp: 'add here the pagination things'
                }
            }

            res.status(200).json(response);

        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });


    // get data by id
    routes.get('/:id', async (req, res) => {

        const acceptType = req.accepts('json');

        if (!acceptType) {
            res.status(406).json({message: 'not agreed'});
            return;
        }

        try {
            const {id} = req.params;
            const url = `${req.protocol}://${req.get('host')}/empires`;
            const empire = await Empire.findById(req.params.id);

            if (!empire) {
                return res.status(404).json({error: 'Empire not found'});
            }

            const empireObjects = empire.toObject();

            const response = {
                ...empireObjects,
                _links: {
                    self: {href: `${url}/${id}`},
                    collection: {href: url}
                }
            };
            res.status(200).json(response);
        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });


    routes.post('/', async (req, res) => {

        const contentType = req.get('Content-Type');

        if (
            contentType !== 'application/json' &&
            contentType !== 'application/x-www-form-urlencoded'
        ) {
            res.status(415).json({message: 'unsupported'});
            return;
        }
        const {civilization, specialty, army, difficulty} = req.body;
        if (!civilization || !specialty || !army || !difficulty) {
            res.status(400).json({message: 'all required'});
            return;
        }
        try {
            await Empire.create({
                civilization: req.body.civilization,
                specialty: req.body.specialty,
                army: req.body.army,
                difficulty: req.body.difficulty
            });

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Accept, Authorization, Origin');
            res.status(201).json({message: 'Empire created !'})

        } catch (err) {
            res.status(500).json({message: err.message})
        }

    });


// create new with faker
//     routes.post('/seeder', async (req,res) =>{
//
//         try {
//             const empires = await Empire.create({
//                 civilization: faker.lorem.word({length:{min:3 , max:10}}),
//                 specialty: faker.lorem.word({length:{min:3 , max:10}}),
//                 army: faker.lorem.word({length:{min:3 , max:10}}),
//                 difficulty: faker.lorem.word({length:{min:3 , max:10}})
//
//             });
//             res.json(empires);
//             console.log('Seed DB');
//         } catch (err){
//             console.log(err);
//             res.status(500).json({error: 'Internal server error'})
//         }
//     });

// update empire

routes.put('/:id', async (req, res) => {
    try {
        // Check if any field is empty
        if (
            !req.body.civilization ||
            !req.body.specialty ||
            !req.body.army ||
            !req.body.difficulty
        ) {
            return res.status(400).json({
                message: 'All fields must be filled for update',
            });
        }

        // Update only non-empty fields
        const updateFields = {
            civilization: req.body.civilization,
            specialty: req.body.specialty,
            army: req.body.army,
            difficulty: req.body.difficulty
        };

        // Update only if all fields are filled
        await Empire.updateOne({ _id: req.params.id }, updateFields);

        // Fetch the updated item
        const item = await Empire.findOne({ _id: req.params.id });
        res.status(200).json(item);
    } catch (err) {
        res.status(400).json({
            message: 'Could not update',
            error: err.message,
        });
    }
});


// Delete empire
    routes.delete('/:id', async (req, res) => {
        try {
            const {id} = req.params;
            const result = await Empire.findByIdAndDelete(id);

            if (!result) {
                return res.status(404).json({message: 'Empire not found'});
            } else {
                return res.status(204).send({message: 'Empire is deleted !'});
            }

            // res.header('Access-Control-Allow-Origin', '*');
            // res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Accept, Authorization, Origin');
            // res.status(201).json({message: 'Empire created !'})

        } catch (err) {
            console.log(err);
            res.status(404).json({error: 'Couldnt find empire'});
        }
    });


    export default routes;