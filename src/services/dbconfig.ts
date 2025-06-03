import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const getSqlConfig = (server: string): sql.config => ({
  server,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT)!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  options: {
    encrypt: false,
    trustServerCertificate: false,
    connectTimeout: 15000,
    ...(process.env.ENVIROMENT === "DEV" && { instanceName: process.env.DB_INSTANCE! }),
  },
});

export const connectToDatabase = async (): Promise<sql.ConnectionPool> => {
  const primaryServer = process.env.DB_SERVER;
  const fallbackServer = process.env.DB_SERVER_FALLBACK;

  if (!primaryServer || !fallbackServer) {
    throw new Error(
      "Configuração inválida: DB_SERVER e DB_SERVER_FALLBACK devem estar definidos no .env"
    );
  }

  try {
    const pool = await sql.connect(getSqlConfig(primaryServer));
    return pool;
  } catch (erro) {
    console.error(
      `Erro ao conectar ao servidor ${primaryServer}:`,
      (erro as Error).message
    );

    try {
      console.log(`Tentando conectar ao servidor fallback: ${fallbackServer}`);
      const pool = await sql.connect(getSqlConfig(fallbackServer));
      return pool;
    } catch (fallbackErro) {
      console.error(
        `Erro ao conectar ao servidor fallback ${fallbackServer}:`,
        (fallbackErro as Error).message
      );
      throw new Error(
        `Falha ao conectar aos servidores ${primaryServer} e ${fallbackServer}`
      );
    }
  }
};

export default getSqlConfig(process.env.DB_SERVER!);