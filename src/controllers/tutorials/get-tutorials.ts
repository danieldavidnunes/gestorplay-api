import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const getTutorials = async (req: Request, res: Response) => {
  try {
    const videoFolderPath = path.join(__dirname, '../../../public/files/uploads/videos/tutoriais');

    const metadata: Record<string, { title: string; description?: string }> = {
      'Gestorplay - Apresentacao.mp4': {
        title: 'Apresentação do GestorPlay',
        description: 'Um vídeo explicando como o GestorPlay funciona',
      },
      'Gestorplay - Subtarefas e Tarefas Dependentes.mp4': {
        title: 'Subtarefas e Tarefas Dependentes',
        description: 'Aprenda como criar subtarefas e definir dependências entre tarefas para organizar melhor seus fluxos de trabalho no GestorPlay.',
      }
    };

    const files = fs.readdirSync(videoFolderPath);
    const videos = files
      .filter((file) => file.endsWith('.mp4'))
      .map((file) => {
        const meta = metadata[file] || {
          title: path.parse(file).name,
          description: 'Sem descrição disponível',
        };

        return {
          title: meta.title,
          description: meta.description,
          url: `${process.env.CURRENT_API}/tutoriais/videos/${encodeURIComponent(file)}`,
        };
      });

    const response = {
      status: 'ok',
      code: 200,
      data: {
        documentos: videos,
      },
    };

    res.status(response.code).json(response);
  } catch (error) {
    console.error('Erro ao ler vídeos:', error);
    res.status(500).json({ status: 'error', code: 500, message: 'Erro interno no servidor' });
  }
};
