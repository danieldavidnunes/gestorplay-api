import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const updateInbox = async (req: Request, res: Response) => {
  const { Uid, IdInbox, Acao } = req.body

  if (!IdInbox || !Uid) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    IdInbox: Number(IdInbox),
    Uid: Number(Uid),
    Acao
  };
  
  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskAtualizaInbox", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};