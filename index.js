const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// mdabubakkars182 
// 9mSy33HPb23k2XQu


//local Uri for offline use

// const uri = "mongodb://localhost:27017/";

const uri = "mongodb+srv://mdabubakkars182:9mSy33HPb23k2XQu@cluster0.y24v7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db('userDb');
    const userCollection = database.collection('users');

    app.get('/users',async(req,res)=>{
       try{
        const cursor = userCollection.find();
        const result = await cursor.toArray();
  
        res.send(result);
       }catch(err){
        console.error('Error occured when reading data from  mongodb',err);
        res.status(500).send({error: 'Internal Server error'});
       }
    })

    app.get('/users/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const user = await userCollection.findOne(query)
        res.send(user);
    })

    app.post('/users',async(req,res)=>{
        try{
          const user = req.body;       
          const result = userCollection.insertOne(user);
          res.send(result);
        }catch(error){
          console.error('Errror when inserting user',error);
          res.status(500).send({error: 'Failed to insert user'})
        } 
    })

    app.put('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const user = req.body;
      console.log(user);

      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };

      const updatedUser = {
        $set: {
          name: user.name, 
          email: user.email
        }
      };

      const result = await userCollection.updateOne(filter,updatedUser,options);

      res.send(result);

      
      
    })


    app.delete('/users/:id', async(req,res) =>{
        try{
          const id = req.params.id;
          console.log('please delete from database',id);

          const query = {_id: new ObjectId(id)};
          const result = userCollection.deleteOne(query);
          res.send(result);

        }catch(err){
          console.log('Error to delete data from db',err)
        }
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('Simple crud is running');
});


app.listen(port,()=>{
    console.log(`simple crud is running port ${port}`);
})



