import crypto from "crypto";
import fs from "fs";
import jose from "node-jose";

if (!fs.existsSync("privateKey.pem") || !fs.existsSync("publicKey.pem")) {
  // Generate an RSA keypair
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });
  // Write the private key to a file
  fs.writeFileSync("privateKey.pem", privateKey);

  // Write the public key to a file
  fs.writeFileSync("publicKey.pem", publicKey);

  jose.JWK.asKey(publicKey, "pem").then((ks) => {
    let jwks = {
      keys: [
        {
          alg: "RS256",
          use: "sig",
          ...ks.toJSON(),
        },
      ],
    };
    fs.writeFileSync("jwks.json", JSON.stringify(jwks));
  });
} else {
  console.log("Key pair already exist");
}
