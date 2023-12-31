const express = require('express');
const cors =require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port =process.env.PORT|| 5000;

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ey6olt5.mongodb.net/?retryWrites=true&w=majority`;
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
    //await client.connect();

    const productCollation = client.db("productDB").collection("product");


    app.get('/product', async(req ,res)=>{
        const cursor = productCollation.find();
       const result = await cursor.toArray();
        res.send(result);


    })
    app.delete('/product/:id', async(req ,res)=>{
        const id = req.params.id;
       const query = {_id: new ObjectId(id)}
       const result =await productCollation.deleteOne(query)
        res.send(result);

    })
   
    app.get('/product/:id', async(req ,res)=>{
        const id = req.params.id;
       const query = {_id: new ObjectId(id)}
       const result =await productCollation.findOne(query)
        res.send(result);

    }) 
    app.put('/product/:id', async(req,res)=>{
           const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options ={upsert:true};

       const updateproduct =req.body;
      const product ={
        $set:{
          Name:updateproduct.Name, 
          Brand_Name:updateproduct.Brand_Name, 
          Type:updateproduct.Type,
           Price:updateproduct.Price, 
          Short_description:updateproduct.Short_description,
           Rating:updateproduct.Rating, 
           Image:updateproduct.Image
        }

      }
      const result =await productCollation.updateOne(filter,product,options)
        res.send(result);

    })

    app.post('/product', async(req ,res)=>{
        const newproduct =req.body;
        console.log(newproduct);
        const result = await productCollation.insertOne(newproduct);
        res.send(result);


    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('brand shope server')
})
app.listen(port,()=>{
    console.log(`brand shop  server is running on port : ${port}`);
})