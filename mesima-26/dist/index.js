"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORT 
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const function_1 = __importDefault(require("./function"));
const dotenv_1 = __importDefault(require("dotenv"));
// ***** //
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// PORT //
const DEFAULT_PORT = 3000;
const SERVER_PORT = Number(process.env.SERVER_PORT) || DEFAULT_PORT;
// Schema
const bookSchema = new mongoose_1.default.Schema({
    id: Number,
    name: String,
    author: String,
    gender: String
});
// Model
const Book = mongoose_1.default.model('Book', bookSchema);
const main = async () => {
    const mongoURI = 'mongodb://127.0.0.1:27017/library2';
    await mongoose_1.default.connect(mongoURI)
        .then(() => {
        console.log('Connexion à MongoDB établie');
    })
        .catch((error) => {
        console.error('Erreur de connexion à MongoDB :', error);
    });
    app.get('/book', async (req, res) => {
        try {
            const listBook = await Book.find();
            res.send(listBook);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("An error has been occured while your research.");
        }
    });
    app.post('/book/create', async (req, res) => {
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
    app.get('/book/search/:value', async (req, res) => {
        try {
            const desc = req.params.value;
            if ((0, function_1.default)(desc)) {
                const listBook = await Book.find({ id: desc });
                res.send(listBook);
            }
            else {
                const listBook = await Book.find({ name: desc });
                res.send(listBook);
            }
        }
        catch (error) {
            res.status(500).send("An error has been occured while advanced search.");
        }
    });
    app.listen(SERVER_PORT, () => {
        console.log('The server has been started on port: ' + SERVER_PORT);
    });
};
const stopServer = async () => {
    try {
        console.log("MongoDB connection closed");
        process.exit(0);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
process.on('SIGINT', stopServer);
process.on('SIGTERM', stopServer);
main().catch(console.error);
