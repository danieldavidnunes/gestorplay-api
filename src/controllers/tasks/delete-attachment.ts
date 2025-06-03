import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const deleteAttachement = async (req: Request, res: Response) => {
  const { Id, Uid, IdTarefa } = req.query

  if (!Id || !IdTarefa || !Uid) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    IdAnexo: Number(Id),
    IdTarefa: Number(IdTarefa),
    Uid: Number(Uid)
  };
  
  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskInativaAnexo", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};