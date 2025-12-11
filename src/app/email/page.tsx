import { EmailForm } from "./emailForm";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/app/email/data-table";
import { columns } from "@/app/email/columns";

export const dynamic = "force-dynamic"; // Forçar a requisição à cada request (sem isso a página não atualizará os dados a cada recarga na página, ele será estático, precisamos que seja dinâmico)

export default async function EmailPage() {
  const data = await prisma.email.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <main className="flex">
      <EmailForm />

      <div className="container mx-auto max-w-lg my-10">
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  );
}
