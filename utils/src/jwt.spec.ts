import { makeJwt, verifyJwt, JwkForJwt } from "./";

// WARNING!! Never use the key pair below for anytrhing but testing.
// It is WIDELY KNOWN and NOT SECURE!!!
const JWK_FOR_TESTING: JwkForJwt = {
  p:
    "78-G9kZaku7bybOWhdvTKIvWHUzs4NLIFbp_7zhkQl4HlEqIrvzfVnjymF76CPSOamv0W7CPscfe7IzqqIKH-62_a1dJvz0q-wxEZLPuf3WBwcvv_us_XUlQ1ZCKc7RN89ZpQ85-oz__SGag9FjMPOxzXYrrhGdfm0bl9VQ5pJ8",
  kty: "RSA",
  q:
    "pydSd3X6un3zAldq-yfj_TfNrX0opZpMP4fPdYj5JdknfXrykQ-oLFMP3nro5FzPVfEAAnZSzzwiLcOERDnkFCuFT3Bl9mtGxVxkIfCuD74bpUlfPMI6GrruN2dyYJk22FC0S3jAbfDjQPBwfv7ZGA5Mf1TqR3cFp4jwDMzTRJU",
  d:
    "lr2_oqRtXd07aeenWUUwktpEWqg0erbiyYOx2aB5GADOILUI9Cnt-mlOf3g7jlBjs6-wXqOkFFeAHQOxOOIf4g6dYb3iGvMu7UAwelQfgn5-mQcOs03leU0PjT_LHcNZE9dUJM4i7sS9MJwPpfhQddZyOCbYEanQCtWFihVlcbgFJvBTT1_K9jJMYsTFVEJLCMud_FZCElGOmph2u9vX7PB2R_IGgHQmHWTMNY41rL44cO_A6edfKEczcAPne8DLn8jkLipfj47lFNh8IWBQbWjzK2FaEbaMUPnTKwKO4x8Uu4Ws0H9Wr5htXQKXAubJYchY1V1hgo_hT7_BVFGT4Q",
  e: "AQAB",
  use: "sig",
  kid: "M5cQOz5Xt9-opKZiYTAfV",
  qi:
    "IEj66K43zRiH0EJbZah_TgBVoyN23h7T1EUgV5QTlI5zgJgG6Y3drE7QAJ94fIISBn_9u6TPKylbBaqtCYfZYnPBxW3cwTQ78MTGmyy8v8Y0l8jYkli8XuNmBqWOSXkbpKuT6ESd3wHgwslr7o8Iv2SKt-Psj05ydbYiWHc7cGY",
  dp:
    "kJS18dUI1n1b1YeIwLt_23ozZQbz6bgrGa6PY1LEX58BQs6NCbM7k47n9CWO6cdH9bGQaZdRiwXNySBMebv48CwYtEa0F7BxMVp8AZrZt87IpGaoEzERytRg_-FdF9UlClXCsTbV8uaqqqP1dlvzBugnxcXzqKgKZDuieP6GolE",
  alg: "RS512",
  dq:
    "YpfPDKeKPHYN4FOvxnTBBZrktnAciZF5Z_-zXqBsVObBZEIg0W9qwro7of7dX9VedlKwrsMcFSBjCJtKaPO8lCkXeMPTYIXmOINGjL5p7N81b0jX4_6sRxf7arKZxGCa-PyhW-Ldnft4D9XChSXM52OHu5NanMyXiTo8XVBzTQ",
  n:
    "nJU26JihJLUJnvzntQCLB1TVF0bG1SZG7Yo_MJYsaG7o-bMCpoB0fGsXSyg_Qnqckt1-o1NBjdGAi7m_jUxNNUcijkFb0Wh7Wg7j4hcN76oMhx-qBYl1EM8BGMftCHtxVSlvkUEAS7ql3NFfGfO5OoFz7Vbp-kMaU_97bfjTBbmnD3oFIWEUMF8UD5618hJTh6WzzqEp8shpXnMbBcUJVitEtCHtwVyLKWkP8c2tsOGDdrZ5GdIRJ7yX-2JP0gaWdwM1N6MKb77pspPJogQ6uuZT3jGR8A21RIbew7eIpOTtwpAAKysqYEHoz_ecr9kwVXeqOgT9SidoLCROuFQMiw",
};

// const JWK_PUBLIC: JwkForJwtPublic = {
//   kty: "RSA",
//   e: "AQAB",
//   use: "sig",
//   kid: "M5cQOz5Xt9-opKZiYTAfV",
//   alg: "RS512",
//   n:
//     "nJU26JihJLUJnvzntQCLB1TVF0bG1SZG7Yo_MJYsaG7o-bMCpoB0fGsXSyg_Qnqckt1-o1NBjdGAi7m_jUxNNUcijkFb0Wh7Wg7j4hcN76oMhx-qBYl1EM8BGMftCHtxVSlvkUEAS7ql3NFfGfO5OoFz7Vbp-kMaU_97bfjTBbmnD3oFIWEUMF8UD5618hJTh6WzzqEp8shpXnMbBcUJVitEtCHtwVyLKWkP8c2tsOGDdrZ5GdIRJ7yX-2JP0gaWdwM1N6MKb77pspPJogQ6uuZT3jGR8A21RIbew7eIpOTtwpAAKysqYEHoz_ecr9kwVXeqOgT9SidoLCROuFQMiw",
// };

describe("JWT Utils", () => {
  it("makes and verifies JWTs", () => {
    let options = {
      audience: "test",
      issuer: "https://justatest.tst",
      subject: "test",
      jwtId: "f7PkMMemU8zBEsjNkWkL8",
    };
    let payload = {
      test: "just testing",
    };
    let jwt = makeJwt({
      jwk: JWK_FOR_TESTING,
      expiresIn: "10 min",
      payload,
      ...options,
    });
    let expected = {
      aud: options.audience,
      iss: options.issuer,
      jti: options.jwtId,
      sub: options.subject,
      ...payload,
    };
    let verified = verifyJwt({ jwk: JWK_FOR_TESTING, token: jwt, ...options });
    expect(verified).toMatchObject(expected);
  });
});
