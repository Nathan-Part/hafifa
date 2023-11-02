"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORT 
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("./routes/router"));
// ***** //
dotenv_1.default.config();
// PORT //
const DEFAULT_PORT = 3000;
const SERVER_PORT = Number(process.env.SERVER_PORT) || DEFAULT_PORT;
// ***** //
const main = async () => {
    const mongoURI = 'mongodb://127.0.0.1:27017/mesima27';
    await mongoose_1.default.connect(mongoURI)
        .then(() => {
        console.log('Connexion à MongoDB établie');
    })
        .catch((error) => {
        console.error('Erreur de connexion à MongoDB :', error);
    });
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/", router_1.default);
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
