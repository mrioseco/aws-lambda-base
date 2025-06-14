import { AbstraInput } from "./adapters/AbstraLambdaInteractor";
import AbstraOutput from "./adapters/AbstraOutput";

export default async (abstraInput: AbstraInput) => {
  console.log({
    environment: process.env.NODE_ENV,
    event: JSON.stringify(abstraInput),
  });
  const payload = abstraInput.body;

  //TODO: CODEAR

  const respuestaRaw = { misalida: "Chao" };

  const resp = AbstraOutput({
    statusCode: 200,
    body: respuestaRaw,
    enableCORS: true,
  });
  return resp;
};
