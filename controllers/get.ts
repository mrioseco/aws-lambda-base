import {
  AbstraInput,
  HttpCompatibleResponse,
} from "../adapters/AbstraLambdaInteractor";
import AbstraOutput from "../adapters/AbstraOutput";

export default async (
  abstraInput: AbstraInput
): Promise<HttpCompatibleResponse> => {
  console.log({
    environment: process.env.NODE_ENV,
    event: JSON.stringify(abstraInput),
  });
  const resp = AbstraOutput({
    statusCode: 200,
    body: {},
    enableCORS: true,
  });
  return resp;
};
