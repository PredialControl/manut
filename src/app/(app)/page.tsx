import prisma from "@/lib/prisma";
import { ContractCard } from "./_components/contract-card";
import { AddContractDialog } from "./_components/add-contract-dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ContractsPortalPage() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  const userContractId = (session?.user as any)?.contractId;

  // Se for ADMIN, mostra todos os contratos. Caso contrário, mostra apenas o contrato do usuário
  const whereClause: any = {
    deleted: false,
  };

  if (userRole !== "ADMIN" && userContractId) {
    whereClause.id = userContractId;
  }

  const contracts = await prisma.contract.findMany({
    where: whereClause,
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex-1 space-y-10 p-10 pt-8 bg-background min-h-screen">
      <div className="flex items-center justify-end animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center space-x-4">
          <Link href="/trash">
            <Button variant="ghost" className="hover:bg-destructive/5 hover:text-destructive transition-all duration-300">
              <Trash className="mr-2 h-4 w-4" /> Ver Lixeira
            </Button>
          </Link>
          <AddContractDialog />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {contracts.map((contract, index) => (
          <div
            key={contract.id}
            className="animate-in fade-in slide-in-from-bottom-8"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
          >
            <ContractCard contract={contract} />
          </div>
        ))}
        {contracts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted/50 p-6 mb-4">
              <Trash className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-lg font-medium mb-2">Nenhum contrato encontrado</p>
            <p className="text-muted-foreground/70 text-sm">Clique em "Novo Contrato" para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}
