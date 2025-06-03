import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const deleteProjects = async (req: Request, res: Response) => {
  const { IdProjeto } = req.params
  const { Uid } = req.query

  if (!IdProjeto) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    IdProjeto: Number(IdProjeto),
    //Uid: Number(Uid)
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskInativaProjeto", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};