import { Request, Response } from 'express';
import { execProc } from "../../services/database";
import { generateInviteCode, generateShortName } from '../../utils';

export const createTeams = async (req: Request, res: Response) => {
  const { Nome, ImagemUrl, UidInc, IdSetor } = req.body

  const isBase64Image = ImagemUrl?.startsWith('data:image/');
  const cleanedBase64 = isBase64Image ? ImagemUrl.replace(/^data:image\/\w+;base64,/, '') : null;
  const shortName = generateShortName();

  const params = {
    UidInc,
    IdSetor,
    Nome,
    Imagem: JSON.stringify({
      base64: cleanedBase64,
      fileName: `p-${shortName}`,
      extension: "jpeg",
    }),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskCriaEquipe", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};