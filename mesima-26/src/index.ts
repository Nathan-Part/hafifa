// IMPORT 
import mongoose from 'mongoose'
import express, {Request} from "express"
import isID from "./function"
import dotenv from "dotenv"
// ***** //

dotenv.config();
const app = express();
app.use(express.json());

// PORT //
const DEFAULT_PORT =3000;
const SERVER_PORT = Number(process.env.SERVER_PORT) || DEFAULT_PORT
// const port:number= SERVER_PORT; 
// ***** //

// Type Of Book
type BookInterface = {
    id: number,
    name: string
    author:string,
    gender: string
}

// Schema
const bookSchema = new mongoose.Schema<BookInterface>({
    id: Number,
    name: String,
    author: String,
    gender: String
});

// Model
const Book = mongoose.model('Book', bookSchema);

const main = async() => {
  const mongoURI = 'mongodb://127.0.0.1:27017/library2';

  await mongoose.connect(mongoURI)
    .then(() => {
      console.log('Connexion à MongoDB établie');
    })
    .catch((error) => {
      console.error('Erreur de connexion à MongoDB :', error);
    });

    app.get('/book', async (req: Request, res) => {
        try {
            const listBook = await Book.find();
            res.send(listBook);
        }
        catch (error)
        {
            console.error(error);
            res.status(500).send("An error has been occured while your research.");
        }
    });

    app.post('/book/create', async (req: Request, res) => {
        try {
          // crée un document
          await new Book(req.body).save();
          res.send("A book has been successfully created");

        }
        catch (error) {
            console.error(error);
            res.status(500).send("An error has been occured during the creation");
        }
    });

    app.get('/book/search/:value', async (req: Request, res) => {
    try {
        const desc = req.params.value;
        if(isID(desc))
        {
          const listBook = await Book.find({id: desc});
          res.send(listBook);
        }
        else
        {
          const listBook = await Book.find({name: desc})
          res.send(listBook); 
        }
    }
    catch (error)
    {
      res.status(500).send("An error has been occured while advanced search.");
    }
  });

  app.listen(SERVER_PORT, () => {
    console.log('The server has been started on port: ' + SERVER_PORT);
  });
  
}

const stopServer = async () => {
  try {
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

process.on('SIGINT', stopServer);
process.on('SIGTERM', stopServer);

main().catch(console.error);