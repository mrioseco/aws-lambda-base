import lambdaInteractor, {
  AbstraInput,
  HttpCompatibleResponse,
} from "./AbstraLambdaInteractor";

type AbstraFunction = (
  abstraInput: AbstraInput
) => Promise<HttpCompatibleResponse>;

export default (main: AbstraFunction) => {
  return async (event, context) => {
    process.env.NODE_ENV = context.invokedFunctionArn
      ? context.invokedFunctionArn.replace(/.*:/g, "")
      : process.env.NODE_ENV;

    process.env.MODE == "debug" ? console.log(event) : null;
    const abstraInput = lambdaInteractor.makeInput(event, context);

    const httpResp = await main(abstraInput);

    if (abstraInput.eventType === "API_GATEWAY") {
      return httpResp;
    }

    try {
      return JSON.parse(httpResp.body);
    } catch (e) {
      return httpResp.body;
    }
  };
};
