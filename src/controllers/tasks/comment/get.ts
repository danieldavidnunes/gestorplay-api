import { Request, Response } from 'express';
import { execProc } from "../../../services/database";

export const getCommentTask = async (req: Request, res: Response) => {
  const { Uid, IdTarefa } = req.query

  const params = {
    ...(Uid && Number(Uid) && { Uid: Number(Uid) }),
    ...(IdTarefa && Number(IdTarefa) && { IdTarefa: Number(IdTarefa) }),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskBuscarComentario", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};