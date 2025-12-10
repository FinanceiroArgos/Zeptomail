'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const sendEmail = async (to: string, subject: string, text: string, file: File | null) => {
  try {
    if (!to || !subject || !text) {
      throw new Error("Campos obrigatórios faltando")
    }

    //  Configurar anexo (BASE64)
    let attachments: any[] = [];

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      attachments.push({
        name: file.name,
        content: buffer.toString("base64"),
        mime_type: file.type || "application/octet-stream",
      });
    }

    //  Payload do Zeptomail
    const payload: any = {
      from: {
        address: "naoresponda@kicard.com.br",
        name: "Kicard",
      },
      to: [
        {
          email_address: {
            address: to,
            name: to,
          },
        },
      ],
      subject,
      htmlbody: text,
    };

    if (attachments.length > 0) {
      payload.attachments = attachments;
    }

    //  CHAMADA À API
    const response = await fetch("https://api.zeptomail.com/v1.1/email", {
      method: "POST",
      headers: {
        "Authorization": process.env.ZEPTO_TOKEN!,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.details)
    }

    // Criar o email na base de dados
    await prisma.email.create({
      data: {
        id: data.request_id,
        email: to,
        status: 'Enviado'
      }
    })

    revalidatePath("/email"); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página

    return "Email enviado com sucesso";
  } catch (error) {
    throw error;
  }
};