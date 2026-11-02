import express from 'express';
import { MongoClient,ObjectId  } from 'mongodb';
import 'dotenv/config'
import cors from 'cors';

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URL);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB();
const db = mongoClient.db("studiospace");
const studiosCollection = db.collection("studios");


app.post('/add-studio', async (req, res) => {
    const studioData = req.body;
    const result = await studiosCollection.insertOne(studioData);
    console.log('Studio added:', result);
    res.send(result);
})
app.get('/studios', async (req, res) => {
    const studios = await studiosCollection.find({}).toArray();
    res.send(studios);
})

app.get('/studios/:id', async (req,res)=>{
  const {id} = req.params;
  const studio = await studiosCollection.findOne({_id:new ObjectId(id)});
  console.log('Studio found:', studio);
  res.send(studio);
})

//http://localhost:8000/studios

app.get('/', (req,res) =>{
    res.send({message:'Server is running successfully!'});
})

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})