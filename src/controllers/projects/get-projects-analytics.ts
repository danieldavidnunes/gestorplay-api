import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const getProjectsAnalytics = async (req: Request, res: Response) => {
  const idProject = req.params?.idproject
  const { Uid, IdEquipe, FiltroIdProjeto, FiltroUidResponsavel, FiltroArquivado, FiltroStatus, FiltroDtInicio, FiltroDtPrevisao } = req.query

  if (!idProject || !Uid || !IdEquipe) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    IdProjeto: Number(idProject),
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