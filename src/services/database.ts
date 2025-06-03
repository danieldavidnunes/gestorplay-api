import { connectToDatabase } from "./dbconfig";

export const execProc = async (nomeProc: string, parametros?: any, supressLog = false): Promise<any> => {
  try {
    // console.log("nomeProc:", nomeProc);
    const pool = await connectToDatabase();
    const request = pool.request();
    if (parametros)
      Object.keys(parametros).forEach((key) => {
        request.input(key, parametros[key]);
      });
    const resultado = await request.execute(nomeProc);
    const objAry = resultado.recordsets as any;
    let objRetorno;

    if (objAry) {
      for (let item of objAry) {
        for (let sub of item) {
          if (sub.Retorno) {
            objRetorno = JSON.parse(sub.Retorno);
          }
        }
      }
    }

    if (objRetorno) {
      if (objRetorno.status === undefined) {
        // console.log(`Falha ao executar/obter dados de: ${nomeProc}`);
        return { status: 'Erro', httpStatusCode: 500, message: 'Ocorreu um erro, tente novamente.', data: { error: resultado, parametros } };
      } else {
        return objRetorno;
      }
    } else {
      // console.log(`Falha ao executar/obter dados de: ${nomeProc}`);
      return { status: 'Erro', httpStatusCode: 500, message: 'Ocorreu um erro, tente novamente.', data: { error: resultado, parametros } };
    }

  } catch (erro) {
    console.error(`Erro ao executar procedure ${nomeProc} #catch:`, erro);
    return { status: 'Erro', httpStatusCode: 500, message: 'Ocorreu um erro, tente novamente.', data: { error: erro, parametros } };
  }
};

export const executarProcedureGeneric = async (nomeProc: string, parametros: any, supressLog = false): Promise<any> => {
  try {
    const pool = await connectToDatabase();
    const request = pool.request();
    Object.keys(parametros).forEach((key) => {
      request.input(key, parametros[key]);
    });
    const resultado = await request.execute(nomeProc);
    const objAry = resultado.recordsets as any;
    let objRetorno: any[] = [];

    if (objAry) {
      for (let item of objAry) {
        for (let sub of item) {
          objRetorno.push(sub);
        }
      }
    }

    if (objRetorno && objRetorno.length > 0) {
      return { status: 'ok', httpStatusCode: 200, message: `Executado com sucesso: ${nomeProc}`, data: objRetorno };
    } else {
      // console.log(`Falha ao executar/obter dados de: ${nomeProc}`);
      return { status: 'Erro', httpStatusCode: 500, message: 'Ocorreu um erro, tente novamente.', data: { error: resultado, parametros } };
    }

  } catch (erro) {
    // console.error("Erro ao executar procedure #catch:", erro);
    // console.log(`Falha ao executar/obter dados de: ${nomeProc}`);
    return { status: 'Erro', httpStatusCode: 500, message: 'Ocorreu um erro, tente novamente.', data: { error: erro, parametros } };
  }
};