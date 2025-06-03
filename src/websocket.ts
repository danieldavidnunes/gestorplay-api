import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

interface Connection {
    id: string;
    uid: number;
    hashId: string;
    connectedAt: number; // timestamp (ms)
}

let io: Server;
const connections: Connection[] = [];

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

// Limpa conexões com mais de 2 dias de inatividade (não renovadas)
function cleanOldConnections() {
    const now = Date.now();
    for (let i = connections.length - 1; i >= 0; i--) {
        const conn = connections[i];
        if (now - conn.connectedAt > TWO_DAYS_MS) {
            // console.log(`Removendo conexão antiga: ${conn.uid} (${conn.id})`);
            connections.splice(i, 1);
        }
    }
}

export function setupWebsocket(server: HttpServer) {
    io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                const allowedOrigins = [
                    "http://localhost:3000",
                    "http://192.168.12.250:3000",
                    process.env.FRONTEND_HOST
                ];
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true
        }
    });

    // Roda limpeza de conexões antigas a cada 1 hora
    setInterval(cleanOldConnections, 60 * 60 * 1000);

    io.on("connection", (socket: Socket) => {
        const uid = Number(socket.handshake.query.uid) as number;
        const hashId = socket.handshake.query.hashId as string;

        if (!uid || !hashId) {
            console.warn("Conexão sem UID ou hashId - desconectando");
            socket.disconnect(true);
            return;
        }

        // Remove conexões duplicadas com o mesmo uid e hashId (exceto essa)
        const duplicates = connections.filter(
            conn => conn.uid === uid && conn.hashId === hashId && conn.id !== socket.id
        );

        for (const dup of duplicates) {
            const existingSocket = io.sockets.sockets.get(dup.id);
            if (existingSocket) {
                existingSocket.disconnect(true);
            }
            removeConnection(dup.id);
        }

        // Atualiza ou adiciona conexão
        const existingIndex = connections.findIndex(conn => conn.uid === uid && conn.hashId === hashId);
        if (existingIndex !== -1) {
            connections[existingIndex] = {
                id: socket.id,
                uid,
                hashId,
                connectedAt: Date.now()
            };
        } else {
            connections.push({
                id: socket.id,
                uid,
                hashId,
                connectedAt: Date.now()
            });
        }

        // console.log(`Conectado: ${uid} (${socket.id})`);
        // console.log("Conexões atuais:", connections);

        socket.on("logout", () => {
            removeConnection(socket.id);
            socket.disconnect(true);
        });

        socket.on("disconnect", () => {
            removeConnection(socket.id);
        });
    });
}

// export function findConnections(uid: number, hashId?: string): Connection[] {
//     return connections.filter(connection => connection.uid === uid);
// }

export function findConnections(uid?: number, hashId?: string): Connection[] {
    return connections.filter(connection => {
        if (uid && hashId) {
            return connection.uid === uid && connection.hashId === hashId;
        } else if (uid) {
            return connection.uid === uid;
        } else if (hashId) {
            return connection.hashId === hashId;
        }
        return connection;
    });
}

export function sendMessage({ to = "*", endpoint, data }: {
    to: Connection[] | "*",
    endpoint: string,
    data: any
}): void {
    const recipients = to === "*" ? connections : to;
    recipients.forEach(connection => {
        io.to(connection.id).emit(endpoint, data);
    });
}

export function removeConnection(socketId: string): void {
    const index = connections.findIndex(conn => conn.id === socketId);
    if (index !== -1) {
        connections.splice(index, 1);
    }
}
