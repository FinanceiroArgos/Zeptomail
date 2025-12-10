import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const body = await req.json();
  const request_id = body.event_message[0].request_id

  // Atualizar o status do email na base de dados
  await prisma.email.update({
    where: { id: request_id }, data: {
      status: 'Erro'
    }
  })

  return new Response("ok", { status: 200 });
}
