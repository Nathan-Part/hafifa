const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

const run = async() => {
  try {
    await client.connect();
    console.log("connected to mongoDB");
    const db = client.db('library');
    const books = db.collection('books');
    const authors = db.collection('author'); 

    // search book
    // const query = { name: "Livre3"};
    // const book = await books.findOne(query);
    // console.log(book);

    //created book
    // const document = {
    //   "name": "Livre3",
    //   "description": "Livre3",
    //   "number_of_page": 120,
    //   "date_of_publication": new Date("2023-06-05T21:00:00.000Z"),
    //   "author": new ObjectId("6485ca93735f24b051fbdb09")
    // };
    // await books.insertOne(document);
    
    //update
    // await books.updateOne(
    //   { _id: new ObjectId("6485ce58735f24b051fbdb27") },
    //   { $set: { name: "New title of the book" } }
    // );
    
    //delete 
    // await books.deleteOne({ name: "Livre2" });

    // display the information of the books with the name of the writters
    // const author = await authors.findOne({ name: "Partouche"});
    // const authorId = author._id; 
    // const book = await books.find({ author: authorId }).toArray(); 
    // console.log(book);

    //find the book with the description not completed
    // const book = await books.find({ description: { $regex: /^super/i } }).toArray();
    // console.log(book);

    // sort the books with the number of page and by order ASC
    // const book = await books.find({number_of_page: {$gt: 100}}).sort({number_of_page: 1}).toArray();
    // console.log(book);

    // agregate 
    // const aggregationPipeline = [
    //   {
    //     $lookup: {
    //       from: "author", // mettre ici la collection avec laquel on va faire la jointure c'est a dire on a la clé etrangere dans la collection book et l'id dans l'author donc mettre la collection qui possedent l'id ici
    //       localField: "author", // champ qui possede la clé etrangere 
    //       foreignField: "_id", // champ avec lequel on souhaite comparé le localField
    //       as: "authorInfo"
    //     }
    //   },
    //   {
    //     $unwind: "$authorInfo"
    //   }
    // ];

    // and
    db.collection.find({
      $and: [
        { name: "livre1" },
        { number_of_page: { $gt: 200 } },
        { $expr: { $eq: [{ $year: "$date_of_publication" }, 2015] } }
      ]
    });
    
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
} 

run().catch(console.error);