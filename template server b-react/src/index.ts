// IMPORT 
import mongoose from 'mongoose'
import express from "express"
import dotenv from "dotenv"
import router from './routes/router';
// ***** //

dotenv.config();

// PORT //
const DEFAULT_PORT = 3000;
const SERVER_PORT = Number(process.env.SERVER_PORT) || DEFAULT_PORT
// ***** //

const main = async () => {
  const mongoURI = 'mongodb://127.0.0.1:27017/mesima27';

  await mongoose.connect(mongoURI)
    .then(() => {
      console.log('Connexion à MongoDB établie');
    })
    .catch((error) => {
      console.error('Erreur de connexion à MongoDB :', error);
    });

  const app = express();
  app.use(express.json());
  app.use("/", router);


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