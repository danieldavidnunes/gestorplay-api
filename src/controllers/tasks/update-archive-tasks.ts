import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const updateArchiveTask = async (req: Request, res: Response) => {
  const { IdEquipe } = req.params
  const { Uid, IdsTarefas }: { Uid: number; IdsTarefas: number[] } = req.body

  if (!IdEquipe || !IdsTarefas.length || !Uid) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    ...(IdEquipe && Number(IdEquipe) && { IdEquipe: Number(IdEquipe) }),
    Uid: Number(Uid),
    DadosJSON: JSON.stringify({ IdsTarefas })
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskArquivaTarefa", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};