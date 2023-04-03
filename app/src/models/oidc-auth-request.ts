import { z } from "zod";
import { ApiError } from "~/lib/api-error";
import { isValidUrl } from "~/utils";

const responseTypeSchema = z.string().refine(
  (value) => {
    const regex = /^(code|id_token|token)( (code|id_token|token)){0,2}$/;
    const isValid = regex.test(value);
    const parts = value.split(" ");
    const uniqueParts = new Set(parts);

    return isValid && parts.length === uniqueParts.size;
  },
  {
    message: "Invalid response type combination.",
  }
);

export const OidcAuthRequestSchema = z.object({
  response_type: responseTypeSchema,
  client_id: z.string().nonempty(),
  redirect_uri: z.string().url(),
  scope: z
    .string()
    .nonempty()
    .refine(
      (value) => {
        const scopes = value.split(" ");
        return scopes.includes("openid");
      },
      {
        message: "The 'openid' scope is required.",
      }
    ),

  // Optional parameters
  state: z.string().nullish(),
  code_challenge: z.string().nullish(),
  code_challenge_method: z.enum(["plain", "S256"]).nullish(),
  display: z.enum(["page", "popup", "touch", "wap"]).nullish(),
  prompt: z
    .string()
    .nullish()
    .refine(
      (value) => {
        if (value == null) {
          return true;
        }
        const prompts = value.split(" ");
        const validPrompts = ["none", "login", "consent", "select_account"];
        return prompts.every((prompt) => validPrompts.includes(prompt));
      },
      {
        message:
          "Invalid prompt value. Must be a combination of 'none', 'login', 'consent', and/or 'select_account'.",
      }
    ),
  max_age: z.number().min(0).nullish(),
  ui_locales: z.string().nullish(),
  id_token_hint: z.string().nullish(),
  login_hint: z.string().nullish(),
  acr_values: z.string().nullish(),
  request: z.string().nullish(),
  request_uri: z.string().url().nullish(),
  response_mode: z.enum(["query", "fragment", "form_post"]).nullish(),
  nonce: z.string().nullish(),
});

export type OidcAuthRequest = z.infer<typeof OidcAuthRequestSchema>;

export function oidcAuthRequest(params: unknown): OidcAuthRequest {
  return OidcAuthRequestSchema.parse(params);
}

export function extractRedirectUri(params: Record<string, unknown>) {
  const isValidParams = params satisfies Record<string, unknown>;
  const hasRedirectUri = typeof params["redirect_uri"] == "string";

  if (!isValidParams || !hasRedirectUri) {
    throw ApiError.badRequest({ message: "Missing redirect URI" });
  }

  if (!isValidUrl(params.redirect_uri as string)) {
    throw ApiError.badRequest({ message: "Invalid redirect URI" });
  }

  return params.redirect_uri as string;
}
