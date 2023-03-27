import { DynamoDB } from "aws-sdk";
import { DataMapper } from "@aws/dynamodb-data-mapper";
import { CustomError } from "../../errors/CustomError";

const client = new DynamoDB({
  region: process.env.DB_REGION || "us-east-1",
  endpoint: process.env.DB_ENDPOINT,
  accessKeyId: process.env.DB_ACCESS_KEY_ID,
  secretAccessKey: process.env.DB_SECRET_ACCESS_KEY,
});

const mapper = new DataMapper({ client });
export type DbClient = DataMapper;

export const dbClient: DbClient = new Proxy(mapper, {
  get(target, propKey, _receiver) {
    const original = target[propKey];
    return typeof original === "function"
      ? function (...args: any) {
          try {
            return original.bind(target, ...args)();
          } catch (err) {
            console.error(err);
            throw new DbClientError(err);
          }
        }
      : original;
  },
});

export class DbClientError extends CustomError {
  constructor(cause: Error) {
    super({
      name: "DbClientError",
      message: "An unhandled database exception occured.",
      cause,
    });
  }
}
