import prisma from "@/lib/prisma";
import { UserDialog } from "./_components/user-dialog";
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
import { deleteUser } from "../actions";

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        include: {
            contract: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    const contracts = await prisma.contract.findMany({
        where: { deleted: false },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
                    <p className="text-muted-foreground">
                        Crie novos logins e gerencie o acesso ao sistema.
                    </p>
                </div>
                <UserDialog contracts={contracts} />
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead>Contrato Associado</TableHead>
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
                                        user.role === "ADMIN" ? "destructive" :
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
                                <TableCell>
                                    {user.contract ? (
                                        <Badge variant="outline">{user.contract.name}</Badge>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">-- Global --</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <UserDialog user={user} contracts={contracts} />
                                    <form action={deleteUser.bind(null, user.id)} className="inline-block">
                                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Nenhum usuário encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
