import { Request, Response } from 'express';
import { execProc } from "../../services/database";
import { findConnections, sendMessage } from '../../websocket';

export const sendSocketRequest = async (req: Request, res: Response) => {
  const { data, hashId, uid, endpoint } = req.body
  try {
    if (!data || !endpoint) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

    try {
      const response = await sendSocket({ data, uid, hashId, endpoint })
      res.status(response?.code || 200).json(response);
    } catch (error) {
      console.log("error no sendSocketRequest:", error);
      res.status(400).json(error);
    }

  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};

export const sendSocket = async ({ data, hashId, uid, endpoint }: { data: any; hashId: string; uid: string; endpoint: string; }) => {
  try {
    if (!data || !endpoint) return { status: "error", code: 400, message: "Dados não enviados." };

    let connections
    if (uid && uid !== "*") {
      connections = findConnections(Number(uid), hashId)
    } else if (uid = "*") {
      connections = findConnections()
    }

    if (!connections || !connections.length) return { status: "ok", code: 200, message: "Nenhum usuário encontrado" };

    sendMessage({ to: connections, data, endpoint })

  } catch (error) {
    return { status: "error", code: 500, message: "Erro interno no servidor" }
  }
};
