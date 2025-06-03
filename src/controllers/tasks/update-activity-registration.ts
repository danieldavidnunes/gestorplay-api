import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const updateTasksActivityRegistration = async (req: Request, res: Response) => {
  const { Uid, IdTempo, DtInicio, DtFim } = req.body

  if (!IdTempo || !Uid) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    ...(IdTempo && Number(IdTempo) && { IdTempo: Number(IdTempo) }),
    ...(Uid && Number(Uid) && { Uid: Number(Uid) }),
    ...(DtInicio && { DtInicio }),
    ...(DtFim && { DtFim }),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskEditaTarefaAtividade", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};