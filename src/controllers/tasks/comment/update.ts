import { Request, Response } from 'express';
import { execProc } from "../../../services/database";

export const updateCommentTask = async (req: Request, res: Response) => {
  const { Uid, IdTarefa, Comentario, } = req.body
  const { IdComentario } = req.params

  if (!IdComentario) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    ...(Uid && Number(Uid) && { Uid: Number(Uid) }),
    ...(IdTarefa && Number(IdTarefa) && { IdTarefa: Number(IdTarefa) }),
    ...(IdComentario && Number(IdComentario) && { IdComentario: Number(IdComentario) }),
    Comentario
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskEditaComentario", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};