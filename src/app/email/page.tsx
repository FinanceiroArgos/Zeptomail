"use client";

import { useState } from "react";

export default function EmailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function sendEmail(e: any) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("text", text);
    if (file) formData.append("file", file);

    const res = await fetch("/api/send-email", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.ok) setMsg("✅ E-mail enviado com sucesso!");
    else setMsg("❌ Erro: " + data.error);

    setLoading(false);
  }

  return (
     <div style={{  }} className="border p-4 rounded-lg max-w-lg mx-auto my-10">
      <h1 className="text-center mb-5">Enviar E-mail</h1>

      <form onSubmit={sendEmail}>
        <label>Destinatário:</label>
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
          className="w-full p-2 border rounded-lg mb-4"
        />

        <label>Assunto:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
           className="w-full p-2 border rounded-lg mb-4"
        />

        <label>Mensagem:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
           className="w-full p-2 border rounded-lg mb-4"
        />

        <label>Anexo (opcional):</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full p-2 border rounded-lg mb-4 cursor-pointer"
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            width: "100%",
          }}
        >
          {loading ? "Enviando..." : "Enviar E-mail"}
        </button>

        {msg && (
          <p style={{ marginTop: 20, fontWeight: "bold" }}>
            {msg}
          </p>
        )}
      </form>
    </div>
  );
}
