import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const getUsers = async (req: Request, res: Response) => {
  const { IdEquipe, Search, All } = req.query

  if (!IdEquipe) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });
  if (!Search) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    ...(IdEquipe && Number(IdEquipe) && { IdEquipe: Number(IdEquipe) }),
    ...(Search && { StrBusca: Search }),
    ...(All && { Todos: All }),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskBuscaUsuario", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};