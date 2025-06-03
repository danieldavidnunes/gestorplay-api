import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const getPointMark = async (req: Request, res: Response) => {
  const { Uid, Type } = req.query

  if (!Uid || !Type) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    ...(Uid && Number(Uid) && { Uid: Number(Uid) }),
    ...(Type && { ReqType: Type }),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskUsuarioPonto", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};

export const updatePointMark = async (req: Request, res: Response) => {
  const { Uid, Type } = req.body

  if (!Uid || !Type) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    ...(Uid && Number(Uid) && { Uid: Number(Uid) }),
    ...(Type && { ReqType: Type }),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskUsuarioPonto", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};