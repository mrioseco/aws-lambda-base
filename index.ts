import AbstraLambdaHandler from "./adapters/AbstraLambdaHandler";
import main from "./main";
export const handler = AbstraLambdaHandler(main);
