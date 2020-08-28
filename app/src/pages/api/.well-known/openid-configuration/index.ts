import { NextApiRequest, NextApiResponse } from "next";
import config from "./_config.json";
export default (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;
  res.json(JSON.stringify(config, null, 2));
};
