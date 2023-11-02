const { MongoClient, ObjectId } = require("mongodb");
const express = require('express');
const app = express();
const port = 3000;

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

app.use(express.json());

const run = async() => {

    const db = client.db('library');
    const books = db.collection('books');
    const authors = db.collection('author'); 
    console.log("Connected to MongoDB");
    await client.connect();

    app.get('/author/search/:pseudo', async (req, res) => {
        try {

            const pseudoAuthor = req.params.pseudo;
            const author = await authors.findOne({ pseudo: pseudoAuthor});
            if(author)
            {
                const authorId = author._id;
                const book = await books.find({ author: authorId }).toArray(); 
                res.send(book); 
            }
            else
            {
                res.status(404).send("No results matches for your search.");
            }
        }
        catch (error)
        {
            console.error(error);
            res.status(500).send("An error has been occured while author research.");
        }
    });

    app.get('/book/search/:description', async (req, res) => {
        try {
            const desc = req.params.description;
            const regex = new RegExp(`^${desc}`, "i");
            const book = await books.find({ description: { $regex: regex } }).toArray();
            if(book.length !== 0)
            {
                res.send(book);
            }
            else
            {
                res.status(404).send("No results matches for your search");
            }
        } 
        catch (error) 
        {
            console.error(error);
            res.status(500).send("An error has been occured while book research");
        }
    });

    app.get('/book/long', async (req, res) => {
        try {
            const book = await books.find({number_of_page: {$gt: 250}}).sort({number_of_page: 1}).toArray();
            if(book.length !== 0)
            {
                res.send(book);
            }
            else
            {
                res.status(404).send("No results matches for your search");
            }            
        } 
        catch (error) 
        {
            console.error(error);
            res.status(500).send("Une erreur s'est produite lors de la recherche de l'auteur.");
        }
    });

    app.post('/book/new', async (req, res) => {        
        try {          
            const body = req.body;
            console.log(body);
            if(Object.keys(body).length !== 0)
            {
                await books.insertOne(body);
                res.send("The document has been successfully created");         
            }
            else
            {
                res.status(404).send("Your body is empty");
            }
        } 
        catch (error) 
        {
            console.error(error);
            res.status(500).send("Une erreur s'est produite lors de la recherche de l'auteur.");
        }
    });

    app.post('/author/new', async (req, res) => {        
        try {          
            const body = req.body;
            console.log(body);
            if(Object.keys(body).length !== 0)
            {
                await authors.insertOne(body);
                res.send("The document has been successfully created");         
            }
            else
            {
                res.status(404).send("Your body is empty");
            }
        } 
        catch (error) 
        {
            console.error(error);
            res.status(500).send("Une erreur s'est produite lors de la recherche de l'auteur.");
        }
    });

}

const stopServer = async () => {
  try {
    await client.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

process.on('SIGINT', stopServer);
process.on('SIGTERM', stopServer);

app.listen(port, () => {
  console.log('The server has been started on port: ' + port);
});

run().catch(console.error);