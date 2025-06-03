import { Request } from "express";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import os from 'os';
import { generateToken } from "../shared/generate-token";
import { execProc } from "../services/database";

/**
 * Faz o login na api do bookplay ou interno
 * a ferramenta de login é configurada na tabela CoreAPIConfig.FerramentaLogin
 * @param user 
 * @param password 
 * @param dev true expira o token em menos de 1 minuto para testes.
 * @returns 
 */
export async function getToken(user: string, password: string, dev?: string): Promise<any> {
  try {

    const resConfig = await execProc('dbo.ProcCoreAPIConfig', {
      CodUsuario: 0,
      Metodo: 'GET'
    });

    if (resConfig.Retorno.httpStatusCode !== 200) {
      throw ('Erro ao buscar configurações da API.');
    }

    let ferramentaLogin = resConfig.Retorno.data.FerramentaLogin;
    if (!ferramentaLogin) {
      throw ('Ferramenta de login não configurada.');
    }

    if (dev?.toUpperCase() === 'SIM') {
      ferramentaLogin = 'interno';
    }

    const body = { username: user, password: password, tracking: "" };

    /* login interno */
    if (ferramentaLogin === 'interno') {

      const resUsuario = await execProc('dbo.ProcUsuario', {
        CodUsuario: 0,
        Metodo: 'GET',
        DadosJSON: JSON.stringify({ Username: user })
      });

      if (resUsuario.Retorno.httpStatusCode !== 200) {
        if (resUsuario.Retorno.httpStatusCode === 404) {
          throw ('Usuário não encontrado.');
        } else {
          throw ('Erro ao buscar informações do usuário.');
        }
      }

      if (!resUsuario.Retorno.data) {
        throw ('Usuário não encontrado!');
      }

      if (resUsuario.Retorno.data.Senha !== password) {
        /* retirar o if na versão final */
        if (dev?.toUpperCase() !== 'SIM') {
          throw ('Senha inválida.');
        }
      }

      const tokenGenerated = generateToken(resUsuario.Retorno.data.CodUsuario, resUsuario.Retorno.data.Nome, dev?.toUpperCase() === 'SIM');
      return tokenGenerated;
    } else {
      /* login pelo bookplay */
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      const options: RequestInit = {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      };

      let url = `${process.env.URL_API}/session`;
      if (dev && dev.toUpperCase() === 'TRUE') {
        url = `${process.env.URL_API_DEV}/session`;
      }
      const response = await fetch(url, options);

      const jsonResponse = await response.json();

      return jsonResponse;
    }
  } catch (error: any) {
    throw (error || "Erro desconhecido");
  }
}

/**
 * Faz o refresh token na api do bookplay
 * @param token 
 * @param refreshToken 
 * @returns 
 */
export async function getRefresh(token: string, refreshToken: string, dev?: string): Promise<any> {

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": token,
      "RefreshToken": refreshToken
    };

    const options: RequestInit = {
      method: "POST",
      headers
    };

    let url = `${process.env.URL_API}/refresh`;
    if (dev && dev.toUpperCase() === 'TRUE') {
      url = `${process.env.URL_API_DEV}/refresh`;
    }

    const response = await fetch(url, options);
    const jsonResponse = await response.json();

    return jsonResponse;
  } catch (error: any) {
    throw new Error(error.message || "Erro desconhecido");
  }
}

/**
 * Extrai os dados do usuário do token
 * @param req 
 * @param token se passar esse parâmetro será desse que será extraído os dados. 
 * @returns CodUsuario e Name
 */
export function dadosUsuarioByToken(req?: Request, token?: string) {
  try {
    let providedToken: string;
    if (!token) {
      const authHeader = req?.header("Authorization");
      if (!authHeader) return null;

      if (authHeader.startsWith("Bearer ")) {
        providedToken = authHeader.split(" ")[1];
      } else {
        providedToken = authHeader;
      }
    } else {
      providedToken = token;
    }

    //const segredo = process.env.JWT_SEGREDO || "segredo";
    //const decoded = jwt.verify(providedToken, segredo);
    //const payload = decoded as jwt.JwtPayload;
    //NÃO PRECISA VALIDAR, SÓ EXTRAIR OS DADOS
    const payload = jwt.decode(providedToken) as any;

    const CodUsuario = payload?.profile?.id;
    const Name = payload?.profile.name;
    const ava = payload?.permissions.includes("ava");

    return { CodUsuario: CodUsuario, Name: Name, AVA: ava, Token: providedToken }
  } catch (error: any) {
    return { CodUsuario: 0, Name: '', AVA: '', Error: error.name }
  }
}

/**
 * Faz a validação da request
 * @param req Request
 * @returns 
 */
export function ValidateRequest(req: Request) {
  try {
    const apiKey = req.headers.api_key as string;
    if (apiKey !== process.env.API_KEY) {
      throw ('Chave da API inválida ou ausente.')
    }

    const authHeader = req.header("Authorization");
    if (!authHeader) {
      throw ("Token ausente na header (Authorization).");
    }

    let token: string;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }

    const segredo = process.env.JWT_SEGREDO || "segredo";
    const decoded = jwt.verify(token, segredo);
    const payload = decoded as jwt.JwtPayload;
    const CodUsuario = payload?.profile?.id;
    const ava = payload?.permissions.includes("ava");

    if (!CodUsuario) {
      throw ("Id usuário não encontrado");
    }

    if (!ava) {
      throw ('Token inválido, não tem permissão de acesso ao AVA.')
    }

    return { success: true, CodUsuario: CodUsuario, message: 'Token válido.' }
  } catch (error: any) {
    return {
      success: false,
      CodUsuario: 0,
      message: 'Ocorreu um erro inesperado.',
      error: error.name === 'TokenExpiredError' ? 'token.expired' : error.name === 'JsonWebTokenError' ? 'token.invalid' : error
    }
  }

}

/**
 * Verifica se não é uma rota dinâmica
 * @param rota 
 * @returns 
 */
export function NotRotaDinamica(rota: string): boolean {
  const staticRoutes = new Set([
    '/login',
    '/logout',
    '/check-token',
    '/refresh',
    '/build-info',
    '/usuario/criar',
    '/cep',
    '/redirect/lti/launch',
    '/api-docs'
  ]);
  // Verifica se a rota está no conjunto de rotas fixas ou começa com '/public/'
  return staticRoutes.has(rota) || rota.startsWith('/public/');
}

/**
 * Para verificar se a rota irá validar o token
 * @param rota 
 * @returns 
 */
export function NaoValidarToken(rota: string): boolean {
  const naoValidar = new Set([
    '/usuario/sessao',
    '/usuario/permissoes',
    //'/redirect/lti/launch'
  ]);
  return naoValidar.has(rota);
}

/**
 * Vai devolver qual a pasta public de armazenamento de arquivos upload/download
 * Contém a estrutura padrão de pastas para cada extensão de arquivo
 * @param fileExt extensão do arquivo
 * @returns 
 */
export function folderByFileExt(fileExt: string, nivel: string = './') {
  fileExt = fileExt.toLowerCase();
  let folder = nivel + 'public/uploads/others'; // Diretório padrão para tipos desconhecidos
  if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.bitmap'].includes(fileExt)) {
    folder = nivel + 'public/uploads/images';
  } else if (['.mp4', '.mov', '.avi', '.3gp'].includes(fileExt)) {
    folder = nivel + 'public/uploads/videos';
  } else if (['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv'].includes(fileExt)) {
    folder = nivel + 'public/uploads/documents';
  }
  return folder;
}

/**
 * Vai gerar o token de upload/download de arquivos da api.
 * @param filename 
 * @returns 
 */
export function generateTokenUploadDownload(filename: string): string {
  //nunca altere o secret, alto risco de quebrar todos links de arquivos
  const secret = 'lk3j4390E$89#fd@flkj';
  return crypto.createHash('md5').update(filename + secret).digest('hex');
}

export function isLinux(): boolean {
  const osPlatform = os.platform();
  return osPlatform.includes('linux');
}

export function onlyNumbers(input: string): string {
  return input.replace(/\D/g, "");
}

export function getFirstAndLastName(fullName: string): string {
  const names = fullName.trim().split(/\s+/); // Divide o nome em partes, ignorando espaços extras
  if (names.length === 1) {
    return names[0]; // Se houver apenas um nome, retorna o único nome
  }
  const firstName = names[0];
  const lastName = names[names.length - 1];
  return `${firstName} ${lastName}`;
}

export function getFirstName(fullName: string): string {
  const names = fullName.trim().split(/\s+/);
  return names[0];
}

export function getLastName(fullName: string): string {
  const names = fullName.trim().split(/\s+/);
  const lastName = names[names.length - 1];
  return lastName;
}

export function formatIP(ip: number | string): string {
  if (!ip) return ''

  const ipStr = ip.toString();

  const parts = ipStr.split(".");

  if (parts.length === 4) {
    return `${parts[0]}.**.**.*${parts[3].slice(-2)}`;
  }

  if (!isNaN(Number(ipStr))) {
    return `${ipStr.slice(0, 3)}.**.**.*${ipStr.slice(-2)}`;
  }

  return ipStr;
}

export function generateInviteCode(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export function generateShortName() {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
};

export function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};