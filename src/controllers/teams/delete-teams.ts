import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const deleteTeams = async (req: Request, res: Response) => {
  const { IdEquipe, Uid } = req.params

  if (!IdEquipe) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    IdEquipe: Number(IdEquipe),
    // Uid: Number(Uid)
  };
  
  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskInativaEquipe", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};