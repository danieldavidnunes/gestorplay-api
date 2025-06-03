import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const updateUsers = async (req: Request, res: Response) => {
  const { Uid, IdEquipe, UidGerenciar, Acao, Telefone, CustoEfetivo } = req.body

  if (!Uid) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });
  if (!UidGerenciar) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    ...(IdEquipe && Number(IdEquipe) && { IdEquipe: Number(IdEquipe) }),
    ...(Uid && { Uid: Uid }),
    ...(UidGerenciar && { UidGerenciar: UidGerenciar }),
    ...(Acao && { Acao: Acao }),
    Telefone: Telefone,
    CustoEfetivo: CustoEfetivo?.toString(),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskGerenciaMembro", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};