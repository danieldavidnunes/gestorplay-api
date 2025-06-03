import { Request, Response } from 'express';
import { execProc } from "../../services/database";
import { sendSocket } from '../socket';

export const sendToken = async (req: Request, res: Response) => {
  const { Uid, Token, HashId } = req.body

  if (!Uid || !Token || !HashId) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    Uid: Number(Uid),
    Token: Number(Token),
    HashId,
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskValidaToken", params);

    sendSocket({ uid: Uid, data: response, hashId: HashId, endpoint: "received-auth-token" });

    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};