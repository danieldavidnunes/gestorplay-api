import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import bodyParser from "body-parser";
import { setupWebsocket } from "./websocket";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);

setupWebsocket(server);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const corsOptions = {
  origin: process.env.ENVIROMENT === "DEV" ? "*" : process.env.FRONTEND_HOST,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "refreshToken", "HashId"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
