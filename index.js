const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tvhs2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const inventoryCollection = client.db('rentigerWarehouse').collection('inventory');

        const inventoryUser = client.db('rentigerWarehouse').collection('user');

        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        });

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await inventoryCollection.findOne(query);
            res.send(inventory);
        });
        // POST
        app.post('/inventory', async (req, res) => {
            const newInventory = req.body;
            const result = await inventoryCollection.insertOne(newInventory);
            res.send(result);
        });
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryCollection.deleteOne(query);
            res.send(result);
            // console.log(req.params + 'rentiger');
        });
        app.get('/item/:email', async (req, res) => {
            const user = {
                email: req.params.email
            }
            const result = await inventoryCollection.find(user).toArray();
            console.log(result);
            res.send(result);
        });

        // Update


        app.put('/update/:id', async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };

            // const options = { upsert: true };

            const updateDoc = {
                $set: {
                    description: req.body.description,
                    img: req.body.img,
                    name: req.body.name,
                    price: req.body.price,
                    quantity: req.body.quantity,
                    sold: req.body.sold,
                    supplier: req.body.supplier,

                },
            };
            console.log(req.body);

            const result = await inventoryCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.post('/login', async (req, res) => {


            // const options = { upsert: true };
            const inventory = req.body;
            const result = await inventoryUser.insertOne(inventory);
            console.log(req.body);
            res.send({
                token: '91b35b18639aba175001bee7e80a2ea3d921f1a98f28c50bfdabfc885b964d4717ea62deb6d8ecec1edbdc11488437a524b94e57f60beb37b4800b151083d885'
            })



        })
    }
    finally {

    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})
