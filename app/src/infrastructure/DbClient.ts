import * as dynamoose from "dynamoose";
import { Document } from "dynamoose/dist/Document";

if (process.env.NODE_ENV === "development") {
  dynamoose.aws.ddb.local();
  dynamoose.aws.sdk.config.update({ region: process.env.DB_REGION });
} else {
  dynamoose.aws.sdk.config.update({
    accessKeyId: process.env.DB_ACCESS_KEY_ID,
    secretAccessKey: process.env.DB_SECRET_ACCESS_KEY,
    region: process.env.DB_REGION,
  });
}

export const dbClient = new Proxy(dynamoose, {
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

export interface DbDocument extends Document {}
export type DbClient = typeof dbClient;
// import { DynamoDB } from "aws-sdk";

// const client = new DynamoDB.DocumentClient({
//   region: "us-east-1",
//   endpoint: process.env.DB_ENDPOINT,
//   accessKeyId: process.env.DB_ACCESS_KEY_ID,
//   secretAccessKey: process.env.DB_SECRET_ACCESS_KEY,
// });

// export type DbClient = DynamoDB.DocumentClient;

// export const dbClient: DbClient = new Proxy(client, {
//   get(target, propKey, _receiver) {
//     const original = target[propKey];
//     console.log({ original });
//     return typeof original === "function"
//       ? function (...args: any) {
//           try {
//             return original.bind(target, ...args)();
//           } catch (err) {
//             console.error(err);
//             throw new DbClientError(err);
//           }
//         }
//       : original;
//   },
// });

export class DbClientError extends Error {
  #cause: Error;
  constructor(cause: Error) {
    super("An unhandled database exception occured.");
    this.#cause = cause;
    this.name = "DbClientError";
  }
  public get cause(): Error {
    return this.#cause;
  }
}
