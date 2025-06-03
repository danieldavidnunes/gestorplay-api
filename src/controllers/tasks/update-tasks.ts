import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const updateTask = async (req: Request, res: Response) => {
  const { IdTarefa } = req.params
  const {
    Uid,
    IdEquipe,
    IdProjeto,
    Nome,
    Status,
    Posicao,
    DtVenc,
    Descricao,
    DtIni,
    UidResponsavel,
    Prioridade,
    IdTarefaDependente,
    UidValidador,
    CustoEfetivo,
    CustoPrevisto,
    Validado
  } = req.body

  if (!IdTarefa) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    ...(IdEquipe && Number(IdEquipe) && { IdEquipe: Number(IdEquipe) }),
    IdTarefa: Number(IdTarefa),
    IdProjeto: Number(IdProjeto),
    Uid: Number(Uid),
    Nome,
    Status,
    Posicao,
    DtIni,
    DtVenc,
    Descricao: `${Descricao}`,
    UidResponsavel,
    Prioridade,
    IdTarefaDependente,
    UidValidador,
    CustoEfetivo,
    CustoPrevisto,
    Validado: Validado ? true : false
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskEditaTarefa", params)

    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};