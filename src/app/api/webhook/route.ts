import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const request_id = body.event_message[0].request_id

    // Verificar se recebeu o request_id
    if (!request_id) return new Response("Faltando request_id", { status: 400 });

    // Tenta buscar o email
    const email = await prisma.email.findUnique({
      where: { id: request_id }
    });

    if (!email) return new Response("Email não encontrado", { status: 200 });

    // Atualizar o status do email na base de dados
    await prisma.email.update({
      where: { id: request_id },
      data: { status: 'Erro' }
    })

    return new Response("ok", { status: 200 });
  } catch (e) {
    return new Response("internal error", { status: 500 });
  }


}
