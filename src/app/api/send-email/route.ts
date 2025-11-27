import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    let attachments = [];

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    const transport = nodemailer.createTransport({
      host: process.env.ZEPTO_HOST,
      port: Number(process.env.ZEPTO_PORT),
      auth: {
        user: process.env.ZEPTO_USER,
        pass: process.env.ZEPTO_PASS
      }
    });

    var mailOptions = {
      from: process.env.DEFAULT_FROM,
      to,
      subject,
      text,
      attachments
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Successfully sent');
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


