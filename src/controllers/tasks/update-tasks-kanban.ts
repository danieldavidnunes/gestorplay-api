import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const updateTaskKanban = async (req: Request, res: Response) => {
  const { IdEquipe, Uid, IdProjeto } = req.query
  const { tasks } = req.body
  const params = {
    ...(IdEquipe && { IdEquipe: Number(IdEquipe) }),
    ...(IdProjeto && Number(IdProjeto) && { IdProjeto: Number(IdProjeto) }),
    Uid: Number(Uid),
    TarefasJson: JSON.stringify(tasks)
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskAtualizaTarefasKanban", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};