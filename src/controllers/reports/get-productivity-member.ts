import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const getReportsProductivityMember = async (req: Request, res: Response) => {
  const { Uid, IdEquipe, DtIni, DtFim, UidMembro } = req.query

  if (!IdEquipe) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });
  if (!Uid) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    Uid: Number(Uid),
    UidColaborador: Number(UidMembro),
    IdEquipe: Number(IdEquipe),
    ...(DtIni && { DtIni: DtIni }),
    ...(DtFim && { DtFim: DtFim }),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskRelTarefasPorColaborador", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};