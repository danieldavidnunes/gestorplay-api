import { Request, Response } from 'express';
import { execProc } from "../../../services/database";

export const createCommentTask = async (req: Request, res: Response) => {
  const { UidInc, IdTarefa, Comentario, } = req.body

  const params = {
    ...(UidInc && Number(UidInc) && { UidInc: Number(UidInc) }),
    ...(IdTarefa && Number(IdTarefa) && { IdTarefa: Number(IdTarefa) }),
    Comentario
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskCriaComentario", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};