import { Request, Response } from 'express';
import { execProc } from "../../services/database";

export const validationRefreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.header('refreshToken');
  const HashId = req.header('HashId');
  const isApp = req.query.isApp as string | undefined;
  const IsApp = isApp === "true" ? true : false

  if (!refreshToken) {
    return res.status(400).json({ status: "error", code: 400, message: "Token não enviado." });
  }

  const params = {
    RefreshToken: refreshToken,
    HashId,
    IsApp
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskValidRefreshToken", params);

    response = {
      ...response,
      data: response.data ? {
        ...JSON.parse(response.data.JsonResult),
        twoStep: response.data.TwoStep
      } : null
    };

    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};
