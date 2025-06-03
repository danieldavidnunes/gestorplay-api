import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const getAllProject = async (req: Request, res: Response) => {
  const IdEquipe = req.query?.IdEquipe

  if (!IdEquipe) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    ...(IdEquipe && Number(IdEquipe) && { IdEquipe: Number(IdEquipe) }),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskBuscaProjeto", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};

export const getProject = async (req: Request, res: Response) => {
  const IdEquipe = req.query?.IdEquipe
  const idProject = req.query?.idproject

  if (!IdEquipe || !idProject) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    ...(IdEquipe && Number(IdEquipe) && { IdEquipe: Number(IdEquipe) }),
    ...(idProject && Number(idProject) && { IdProjeto: Number(idProject) })
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskBuscaProjeto", params);

    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};