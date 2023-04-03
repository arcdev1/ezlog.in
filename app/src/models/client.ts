import z from "Zod";

export const clientSchema = z.object({
  id: z.string(),
  client_id: z.string(),
  client_secret: z.string(),
  redirect_uris: z.array(z.string()),
  name: z.string().nullish(),
  created_at: z.date(),
  updated_at: z.date(),
  session_cookie_name: z.string().default("sid"),
  brand_color: z.string().default("#000000"),
  logo_url: z.string().nullish(),
  brand_color_dark: z.string().default("#FFFFFF"),
  logo_url_dark: z.string().nullish(),
});

export type Client = z.infer<typeof clientSchema>;

export function createClient(params: unknown): Client {
  return clientSchema.parse(params);
}
