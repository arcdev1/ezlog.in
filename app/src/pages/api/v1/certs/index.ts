// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

export default (_req: NextApiRequest, res: NextApiResponse) => {
  let jwks = JSON.parse(process.env.jwks);
  let pub = { keys: [] };
  pub.keys = jwks.keys
    .filter(
      (jwk) =>
        process.env.NODE_ENV !== "production" || !jwk.kid.startsWith("TEST")
    )
    .map((jwk) => {
      let { kty, e, use, kid, alg, n } = jwk;
      return { kty, e, use, kid, alg, n };
    });

  res.statusCode = 200;
  res.json(JSON.stringify(pub, null, 2));
};
