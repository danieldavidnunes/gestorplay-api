import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const getTasks = async (req: Request, res: Response) => {
  const { Uid, UidResponsavel, IdEquipe, IdProjeto, IdTarefa, Status, DtIni, DtVenc, MaxTotal, Arquivado, Atrasado, Incompleto, Validar } = req.query

  if (!IdEquipe || !Uid) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    ...(IdEquipe && Number(IdEquipe) && { IdEquipe: Number(IdEquipe) }),
    ...(IdProjeto && Number(IdProjeto) && { IdProjeto: Number(IdProjeto) }),
    ...(IdTarefa && Number(IdTarefa) && { IdTarefa: Number(IdTarefa) }),
    ...(UidResponsavel && Number(UidResponsavel) && { UidResponsavel: Number(UidResponsavel) }),
    ...(MaxTotal && Number(MaxTotal) && { MaxTotal: Number(MaxTotal) }),
    ...(Status && { Status: Status }),
    ...(DtVenc && { DtVenc: DtVenc }),
    ...(DtIni && { DtIni: DtIni }),
    ...(Arquivado && { Arquivado }),
    ...(Arquivado && { Atrasado }),
    ...(Incompleto && { Incompleto }),
    ...(Validar && { Validar }),
    Uid: Number(Uid),
  };
  
  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskBuscaTarefa", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};