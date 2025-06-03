import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const startStopTask = async (req: Request, res: Response) => {
  const { Uid, IdTarefa, UidTarefa } = req.body

  if (!IdTarefa || !Uid) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    ...(Uid && Number(Uid) && { Uid: Number(Uid) }),
    ...(IdTarefa && Number(IdTarefa) && { IdTarefa: Number(IdTarefa) }),
    ...(UidTarefa && Number(UidTarefa) && { UidTarefa: Number(UidTarefa) }),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskTarefaPlayPause", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};