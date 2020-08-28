import * as React from "react";
import { container, TYPES } from "../../ioc/";
import { NameRequestService } from "../../services/NameRequestService";
import { OidcClientName } from "../../entities/oidc-client/OidcClientName";

export default function RegisterClient(props) {
  const [clientName, setClientName] = React.useState<string>("");
  const [clientNameMsg, setClientNameMsg] = React.useState<string>("");
  const [redirectUris, setRedirectUris] = React.useState<string>("");

  function onRegisterClient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    setClientNameMsg("");
    setClientName(e.target.value);
  }

  function onBlurName() {
    const svc: NameRequestService = container.resolve(TYPES.NameRequestService);
    svc.requestName(clientName).then((result) => {
      if (result.errors) {
        setClientNameMsg(result.errors[0].message);
      }
      if (result.isValid) {
        const nameRequest = result.value;
        setClientNameMsg(
          nameRequest.isAvailable ? "Available!" : "Not Available!"
        );
      }
    });
  }

  return (
    <div className="registrationPage">
      <form className="form" method="post" action="/api/v1/clients">
        <h1 className="title">Client Registration</h1>
        <h2 className="subTitle">
          Register a new{" "}
          <a href="https://openid.net/specs/openid-connect-registration-1_0.html#ClientRegistration">
            OIDC client
          </a>
          .
        </h2>
        <fieldset className="fieldSet">
          <label htmlFor="txtClientName" className="fieldLabel">
            Client Name
          </label>
          <input
            className="textBox"
            id="txtClientName"
            name="clientName"
            type="text"
            placeholder="AcmeCo iOS App"
            value={clientName}
            onChange={onChangeName}
            onBlur={onBlurName}
          ></input>
          <small>{clientNameMsg}</small>
        </fieldset>
        <fieldset className="fieldSet">
          <label htmlFor="txtRedirectUris" className="fieldLabel">
            Redirect Uris
            <small className="hint">(One Uri per line)</small>
          </label>

          <textarea
            className="textArea"
            id="txtRedirectUris"
            placeholder="https://www.abc.com"
            // value={redirectUris}
            name="redirectUris"
            // onChange={(e) => setRedirectUris(e.target.value)}
          ></textarea>
        </fieldset>
        <button type="submit" className="submitButton">
          Submit
        </button>
      </form>
    </div>
  );
}
