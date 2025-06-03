import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const getInExecutionTask = async (req: Request, res: Response) => {
  const { Uid, IdEquipe } = req.query

  if (!IdEquipe || !Uid) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    ...(IdEquipe && Number(IdEquipe) && { IdEquipe: Number(IdEquipe) }),
    ...(Uid && Number(Uid) && { Uid: Number(Uid) }),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskBuscarTarefaEmExecucao", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};