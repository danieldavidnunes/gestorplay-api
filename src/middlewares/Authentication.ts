import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const IsAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (process.env.ENVIROMENT === 'DEV') return next();

  if (!authHeader) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Dados de autenticação não enviados! #1"
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Dados de autenticação não enviados! #2"
    });
  }
  try {
    const segredo = process.env.SECRET_JWT || 'segredo';
    const payload: any = jwt.verify(token, segredo);
    req.body.usuario = payload;
    res.locals.userInfo = payload.profile;
    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      code: 401,
      message: "Dados de autenticação não enviados! #3"
    });
    return
  }
};