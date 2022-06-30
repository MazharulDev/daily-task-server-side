const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2tv0rsp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('dailyTask').collection('Task')
        const completeCollection = client.db('dailyTask').collection('complete')
        // post info
        app.post('/task', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result)
        })
        //get info
        app.get('/task', async (req, res) => {
            const task = await taskCollection.find().toArray();
            res.send(task);
        })
        //delete task
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = taskCollection.deleteOne(query);
            res.send(result);
        })
        //complete task
        app.post('/complete', async (req, res) => {
            const completeTask = req.body;
            const result = await completeCollection.insertOne(completeTask);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('running test')
})

app.listen(port, () => {
    console.log("Listening to port", port);
})