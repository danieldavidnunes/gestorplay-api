import { Request, Response } from 'express';
import { execProc } from "../../services/database";
import { generateShortName } from '../../utils';

export const updateProjects = async (req: Request, res: Response) => {
  const { IdProjeto } = req.params
  const { UidInc, Nome, ImagemUrl, imageChanged } = req.body
  const isBase64Image = ImagemUrl?.startsWith('data:image/');
  const cleanedBase64 = isBase64Image ? ImagemUrl.replace(/^data:image\/\w+;base64,/, '') : null;
  const shortName = generateShortName();

  if (!IdProjeto) return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados." });

  const params = {
    IdProjeto: Number(IdProjeto),
    UidInc: Number(UidInc),
    Nome,
    Imagem: JSON.stringify({
      base64: cleanedBase64,
      fileName: `p-${IdProjeto}-${shortName}`,
      extension: "jpeg",
      imageChanged: imageChanged ? imageChanged : false
    }),
  };

  try {
    let response: { status: string; code: number; data?: any; message?: string } = await execProc("ProcTaskEditaProjeto", params);
    res.status(response?.code || 401).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};