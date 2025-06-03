import { Request, Response } from 'express';
import { execProc } from "../../services/database";
import { generateShortName, removeAccents } from '../../utils';

export const uploadAttachmentsTask = async (req: Request, res: Response) => {
  const { data } = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ status: "error", code: 400, message: "Dados não enviados ou inválidos." });
  }

  try {
    const promises = data.map((item) => {
      const { Uid, IdTarefa, base64, fileName, mime, size, extension, type } = item;
      const shortName = generateShortName();
      const cleanedBase64 = base64 ? base64.replace(/^data:.*;base64,/, '') : null;
      const cleanFileName = removeAccents(fileName);

      if (!IdTarefa || !Uid) {
        throw new Error("Dados obrigatórios ausentes.");
      }
 
      const params = {
        ...(IdTarefa && Number(IdTarefa) && { IdTarefa: Number(IdTarefa) }),
        ...(Uid && Number(Uid) && { Uid: Number(Uid) }),
        ...(base64 && { Base64: cleanedBase64 }),
        ...(cleanFileName && { NomeOriginal: cleanFileName }),
        ...(cleanFileName && { NomeArquivo: `${cleanFileName.replace(/\.[^/.]+$/, '').replace(/[./\\\s]/g, '-').replace(/--.*/, '')}--${shortName}` }),
        ...(mime && { Mime: mime }),
        ...(size && { Size: size }),
        ...(extension && { Extensao: extension }),
        ...(type && { Tipo: type }),
      };

      return execProc("ProcTaskUploadAnexo", params);
    });

    const results = await Promise.all(promises);
    res.status(results[0].code || 200).json(results[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", code: 500, message: "Erro interno no servidor" });
  }
};