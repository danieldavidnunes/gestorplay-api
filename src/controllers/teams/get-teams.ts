import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const getTeams = async (req: Request, res: Response) => {
  const params = {
    ...(req.query.IdEquipe && Number(req.query.IdEquipe) && { IdEquipe: Number(req.query.IdEquipe) }),
    ...(req.query.Uid && Number(req.query.Uid) && { Uid: Number(req.query.Uid) })
  };
  
  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskBuscaEquipe", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};