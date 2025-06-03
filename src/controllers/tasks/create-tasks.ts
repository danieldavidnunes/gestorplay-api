import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const createTask = async (req: Request, res: Response) => {
  const { Uid, UidResponsavel, IdTarefa, IdEquipe, IdProjeto, Nome, Status, Posicao, DtVenc, Descricao, DtIni, Prioridade } = req.body
  
  const params = {
    ...(Uid && Number(Uid) && { Uid: Number(Uid) }),
    ...(IdEquipe && Number(IdEquipe) && { IdEquipe: Number(IdEquipe) }),
    ...(IdTarefa && Number(IdTarefa) && { IdTarefa: Number(IdTarefa) }),
    ...(IdProjeto && Number(IdProjeto) && { IdProjeto: Number(IdProjeto) }),
    ...(UidResponsavel && Number(UidResponsavel) && { UidResponsavel: Number(UidResponsavel) }),
    Nome,
    Status,
    Posicao,
    DtIni,
    DtVenc,
    Descricao,
    Prioridade
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskCriaTarefa", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};