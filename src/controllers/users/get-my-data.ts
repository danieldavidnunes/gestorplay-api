import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const getMyUser = async (req: Request, res: Response) => {
  const { Uid, IdEquipe } = req.query

  if (!Uid || !IdEquipe) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    Uid: Number(Uid),
    IdEquipe: Number(IdEquipe),
  };
  
  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskMeusDados", params);
  
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};