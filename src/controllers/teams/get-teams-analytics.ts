import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const getTeamAnalytics = async (req: Request, res: Response) => {
  const IdEquipe = req.params?.IdEquipe
  const { Uid, FiltroIdProjeto, FiltroUidResponsavel, FiltroArquivado, FiltroStatus, FiltroDtInicio, FiltroDtPrevisao } = req.query

  if (!IdEquipe || !Uid) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    Uid: Number(Uid),
    IdEquipe: Number(IdEquipe),
    ...(FiltroIdProjeto && { FiltroIdProjeto }),
    ...(FiltroUidResponsavel && { FiltroUidResponsavel }),
    ...(FiltroArquivado && { FiltroArquivado }),
    ...(FiltroStatus && { FiltroStatus }),
    ...(FiltroDtInicio && { FiltroDtInicio }),
    ...(FiltroDtPrevisao && { FiltroDtPrevisao }),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskAnaliseEquipe", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};