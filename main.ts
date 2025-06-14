import { AbstraInput } from "./adapters/AbstraLambdaInteractor";
import AbstraOutput from "./adapters/AbstraOutput";
import get from "./controllers/get";
import post from "./controllers/post";

export default async (abstraInput: AbstraInput) => {
  console.log({
    environment: process.env.NODE_ENV,
    event: JSON.stringify(abstraInput),
  });
  const payload = abstraInput.body;

  //TODO: CODEAR
  if (abstraInput.eventType === "API_GATEWAY") {
    if (abstraInput.httpMethod === "GET") {
      return get(abstraInput);
    }
  }

  if (abstraInput.eventType === "API_GATEWAY") {
    if (abstraInput.httpMethod === "POST") {
      return post(abstraInput);
    }
  }

  const respuestaRaw = { misalida: "Chao" };

  const resp = AbstraOutput({
    statusCode: 200,
    body: respuestaRaw,
    enableCORS: true,
  });
  return resp;
};
