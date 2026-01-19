import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ContractUserDialog } from "./_components/contract-user-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteContractUser } from "./_actions/manage-contract-users";

interface ContractUsersPageProps {
    searchParams: {
        contractId?: string;
    };
}

export default async function ContractUsersPage({ searchParams }: ContractUsersPageProps) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/login");
    }

    const { contractId } = searchParams;
    const userRole = session.user.role;
    const userContractId = (session.user as any)?.contractId;

    // Determinar qual contrato mostrar
    let targetContractId = contractId;
    
    if (userRole === "ADMIN") {
        // ADMIN pode ver qualquer contrato via query param
        if (!contractId) {
            redirect("/");
        }
    } else if (userRole === "GESTOR") {
        // GESTOR só vê o próprio contrato
        targetContractId = userContractId;
        if (!targetContractId) {
            redirect("/");
        }
    } else {
        // Outras roles não podem acessar
        redirect("/");
    }

    // Buscar contrato
    const contract = await prisma.contract.findUnique({
        where: { id: targetContractId },
    });

    if (!contract) {
        redirect("/");
    }

    // Buscar usuários do contrato (exceto ADMIN que pode ter acesso global)
    const users = await prisma.user.findMany({
        where: {
            contractId: targetContractId,
        },
        include: {
            contract: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Usuários do Contrato: {contract.name}
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie os usuários com acesso a este contrato.
                    </p>
                </div>
                {userRole === "GESTOR" || userRole === "ADMIN" ? (
                    <ContractUserDialog contractId={targetContractId} />
                ) : null}
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name || "Sem nome"}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        user.role === "GESTOR" ? "default" :
                                        "secondary"
                                    }>
                                        {user.role === "ADMIN"
                                            ? "Administrador"
                                            : user.role === "GESTOR"
                                                ? "Gestor"
                                                : user.role === "MANUTENCAO"
                                                    ? "Manutenção"
                                                    : user.role === "ACOMPANHAMENTO"
                                                        ? "Acompanhamento"
                                                        : user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {(userRole === "GESTOR" || userRole === "ADMIN") && 
                                     user.role !== "ADMIN" && 
                                     user.role !== "GESTOR" ? (
                                        <>
                                            <ContractUserDialog contractId={targetContractId} user={user} />
                                            <form action={deleteContractUser.bind(null, targetContractId, user.id)} className="inline-block">
                                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">--</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    Nenhum usuário encontrado neste contrato.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
