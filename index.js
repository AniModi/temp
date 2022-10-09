const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
// Replace the uri string with your connection string.
const uri =
"mongodb+srv://root:rootuser@cluster0.tfekrwi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db('account_details');
    const collection = database.collection('mycollection');
    const query = { name: 'aniruddh' };
    const movie = await collection.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);