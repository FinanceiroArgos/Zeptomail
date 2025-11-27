import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const to = formData.get("to") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;
    const file = formData.get("file") as File | null;

    if (!to || !subject || !text) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando." },
        { status: 400 }
      );
    }

    // ===========================
    //  TRATAR ANEXO (BASE64)
    // ===========================
    let attachments: any[] = [];

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      attachments.push({
        name: file.name,
        content: buffer.toString("base64"),
        mime_type: file.type || "application/octet-stream",
      });
    }

    // ===========================
    //  PAYLOAD DA ZEPTOMAIL
    // ===========================
    const payload: any = {
      from: {
        address: "sac@kicard.com.br",
        name: "Sac kicard",
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

    // ===========================
    //  CHAMADA À API
    // ===========================
    const response = await fetch("https://api.zeptomail.com/v1.1/email", {
      method: "POST",
      headers: {
        "Authorization": process.env.ZEPTO_TOKEN!, // coloque no .env
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro Zepto:", data);
      return NextResponse.json({ error: data }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


