import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const createInbox = async (req: Request, res: Response) => {
  const { Uid, IdEquipe, uidResp, title, type, description, sendToAll, sendToTeam } = req.body

  if (!Uid || !title) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    Uid: Number(Uid),
    Titulo: title,
    Tipo: type,
    Descricao: description,
    EnviarTodos: sendToAll,
    EnviarEquipe: sendToTeam,
    ...(IdEquipe && Number(IdEquipe) && { IdEquipe: Number(IdEquipe) }),
    ...(uidResp && Number(uidResp) && { UidResponsavel: Number(uidResp) }),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskCriaInbox", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};