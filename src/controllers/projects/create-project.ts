import { Request, Response } from 'express';
import { execProc } from "../../services/database";
import { generateShortName } from '../../utils';

export const createProjects = async (req: Request, res: Response) => {
  const { IdEquipe, Nome, ImagemUrl, UidInc, UidLider, UpdateIMG } = req.body
  const isBase64Image = ImagemUrl?.startsWith('data:image/');
  const cleanedBase64 = isBase64Image ? ImagemUrl.replace(/^data:image\/\w+;base64,/, '') : null;
  const shortName = generateShortName();

  const params = {
    IdEquipe,
    Nome,
    Imagem: JSON.stringify({
      base64: cleanedBase64,
      fileName: `p-${shortName}`,
      extension: "jpeg",
    }),
    UidInc,
    UidLider,
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskCriaProjeto", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};