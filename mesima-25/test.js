const mongoose = require('mongoose');

// URL de connexion à MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/library';

const bookSchema = new mongoose.Schema({
    name: String,
    description: String,
    number_of_page: Number,
    date_of_publication: String,
    author: String
  });
  
const Book = mongoose.model('Book', bookSchema);
  
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
        from: "author",
        localField: "author",
        foreignField: "_id",
        as: "authorInfo"
        }
    },
    {
        $unwind: "$authorInfo"
    },
    {
        $match: filter
    }
];

Book.aggregate([data]).sort({'authorInfo.last_name': 1, number_of_page: 1})
.then((books) => {
let book = books.map(book => ({name : book.name, "authorInfo.last_name": book.authorInfo.last_name}));
console.log(book);
})
.catch((error) => {
console.error('Erreur lors de la lecture des livres :', error);
});

    // crée un document
      const newBook = new Book({
        name: "Livre3",
        description: "Super Livre3",
        number_of_page: 260,
        date_of_publication: "2023-06-05T21:00:00.000Z",
        author:  "6485ca93735f24b051fbdb09"
      });
    
      newBook.save()
        .then(() => {
          console.log('Nouveau livre enregistré');
        })
        .catch((error) => {
          console.error('Erreur lors de l\'enregistrement du livre :', error);
        });

    // Mise à jour d'un document
    // Book.findOneAndUpdate({ name: 'Livre1' }, { name: 'Livre11' })
    // .then(() => {
    // console.log('Livre mis à jour');
    // })
    // .catch((error) => {
    // console.error('Erreur lors de la mise à jour du livre :', error);
    // });

    // // Suppression d'un document
    // Book.deleteOne({ name: 'Livre1' })
    // .then(() => {
    // console.log('Livre supprimé');
    // })
    // .catch((error) => {
    // console.error('Erreur lors de la suppression du livre :', error);
    // });
    
// Connexion à MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB établie');
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB :', error);
  });
