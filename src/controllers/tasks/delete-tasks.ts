import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const deleteTask = async (req: Request, res: Response) => {
  const { Id, Uid } = req.query

  if (!Id) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    IdTarefa: Number(Id),
    Uid: Number(Uid)
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskExcluiTarefa", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};