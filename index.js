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
const bookingsCollection = db.collection("bookings");


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
app.get('/studios/:key', async (req, res) => {
    const { key } = req.params;
    try {
        if (ObjectId.isValid(key)) {
            const studio = await studiosCollection.findOne({ _id: new ObjectId(key) });
            console.log('Studio found:', studio);
            res.send(studio);
        } else {
            const studios = await studiosCollection.find({ email: key }).toArray();
            console.log('Host studios:', studios);
            res.send(studios);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to fetch studios' });
    }
})

app.patch('/studios/:id', async(req,res)=>{
  const {id} = req.params;
  const updateData = req.body
  const result = await studiosCollection.updateOne(
    {_id:new ObjectId(id)},
    {$set:updateData}
  )
  res.json(result)
})

app.delete('/studios/:id', async(req,res)=>{

    const {id}=req.params
    const result = await studiosCollection.deleteOne({_id: new ObjectId(id)})
    res.send(result);
})

app.get('/studio-featured/:email', async(req,res)=>{
  const { email } = req.params;
  const studios = await studiosCollection.find({ email: email }).limit(6).toArray();
    res.send(studios);
})
app.get('/studio-featured', async(req,res)=>{
  const studios = await studiosCollection.find({}).limit(6).toArray();
    res.send(studios);
})
app.post('/my-bookings', async (req, res) => {
    const bookingData = req.body;
    const result = await bookingsCollection.insertOne(bookingData);
    console.log('Booking added:', result);
    res.send(result);
})

app.get('/my-booking/:email', async(req,res)=>{
  const {email} = req.params;
   console.log("Received Email:", email);
  const booking = await bookingsCollection.find({email:email}).toArray();
  console.log("Booking Data:", booking);
  res.send(booking);
})

app.delete('/my-booking/:id', async(req,res)=>{
  const {id}= req.params;
  const result= bookingsCollection.deleteOne({_id:id})
  res.send(result)
})

app.patch('/my-booking/:id', async(req,res)=>{
  const {id} = req.params;
  const updateData = req.body
  const result = await bookingsCollection.updateOne(
    {_id:id},
    {$set:updateData}
  )
  res.json(result)
})

//http://localhost:8000/my-booking/:id

app.get('/', (req,res) =>{
    res.send({message:'Server is running successfully!'});
})

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})