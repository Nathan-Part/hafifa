const mongoose = require('mongoose');
const mongoURI = 'mongodb://127.0.0.1:27017/library';

const express = require('express');
const app = express();
// in env
const port = 3000; 
app.use(express.json());

const bookSchema = new mongoose.Schema({
  name: String,
  description: String,
  number_of_page: Number,
  date_of_publication: Date,
  author: String
});

// the variable of the schema
const Book = mongoose.model('Book', bookSchema);


const run = async() => {

  app.get('/book/search/advanced', async (req, res) => {
    try {
      // Lecture des documents
      const filter = {
        $and: [
          { number_of_page: {$gt: 200} },
          { date_of_publication: {
            $gte: new Date('2015-01-01T00:00:00Z'),
            $lte: new Date('2020-12-31T23:59:59Z')
          } },
          { "authorInfo.last_name": { $regex: /^P/i } }
        ]
      };

      const data = [
        {
            $lookup: {
            from: "author", // collection dont on souhaite recupéré les données
            localField: "author", // champ dans la collection actuel qui contient l'id qu'on va comparé
            foreignField: "_id", // l'id primaire de l'autre collection qu'on va comparer avec notre foreign key de cette collection
            as: "authorInfo" // nom du champ qui contiendra les données de l'autre collection
            // en gros on compare l'id de foreignField avec la collection de from pour la comparé avec les données du champs author de la colleciton actuel (book dans ce cas)
          }
        },
        {
            $unwind: "$authorInfo"
        },
        {
            $match: filter
        }
      ];

      const books = await Book.aggregate([data]).sort({'authorInfo.last_name': 1, number_of_page: 1});
      let filteredBook = books.map(book => ({name : book.name, "authorInfo.last_name": book.authorInfo.last_name}));
      console.log(filteredBook);

      if(filteredBook)
      {
          res.send(filteredBook); 
      }
      else
      {
          res.status(404).send("No results matches for your search.");
      }
    }
    catch (error)
    {
        console.error(error);
        res.status(500).send("An error has been occured while advanced search.");
    }
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

app.listen(port, () => {
  console.log('The server has been started on port: ' + port);
});

run().catch(console.error);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB établie');
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB :', error);
  });

