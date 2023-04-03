import { type NextApiRequest, type NextApiResponse } from "next";
import { type Client } from "@prisma/client";
import { prisma } from "~/server/db";
import { ApiError, sendApiError } from "~/lib/api-error";

export default async function clients(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  const { id } = query as { id?: string };

  try {
    switch (method) {
      case "GET":
        if (id) {
          const client = await prisma.client.findUnique({
            where: { id },
          });
          if (!client) {
            const error = ApiError.notFound({ message: "Client not found" });
            return sendApiError({ res, error });
          }
          return res.status(200).json(client);
        }

        const clientList = await prisma.client.findMany();
        return res.status(200).json(clientList);

      case "POST":
        const newClient = await prisma.client.create({
          data: req.body as Client,
        });
        return res.status(201).json(newClient);

      case "PUT":
        const existingClient = await prisma.client.findUnique({
          where: { id },
        });
        if (!existingClient) {
          return res.status(404).json({ message: "Client not found" });
        }
        const updatedClient = await prisma.client.update({
          where: { id },
          data: req.body as Client,
        });
        res.status(200).json(updatedClient);
        break;

      case "DELETE":
        const clientToDelete = await prisma.client.findUnique({
          where: { id },
        });
        if (!clientToDelete) {
          res.status(200).json(clientToDelete);
        }
        const deletedClient = await prisma.client.delete({
          where: { id },
        });
        res.status(200).json(deletedClient);
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        sendApiError({ res, error: ApiError.methodNotAllowed() });
        break;
    }
  } catch (error) {
    console.error(error);
    sendApiError({ res, error: ApiError.fromError(error) });
  }
}
