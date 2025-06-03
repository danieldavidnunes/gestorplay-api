import { Request, Response } from 'express';
import { execProc } from '../../services/database';
import { generateToken } from '../../shared/generate-token';
import axios from 'axios';


export const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    const parametros = {
      Username: username,
      Password: password
    };

    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskLogin", parametros);


    if (response.status === "ok") {

      // const token = generateToken(data.Uid, data.Usuario)
      // response = { ...response, data: { ...response.data, token: token.token } }
    }
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};