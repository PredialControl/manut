import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Building } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        redirect("/login");
    }

    const userId = (session.user as any)?.id;
    const userRole = session.user.role;
    const userContractId = (session.user as any)?.contractId;

    // Buscar informações completas do usuário
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            contract: true,
        },
    });

    if (!user) {
        redirect("/login");
    }

    const roleLabel = 
        userRole === "ADMIN" ? "Administrador" :
        userRole === "GESTOR" ? "Gestor" :
        userRole === "MANUTENCAO" ? "Manutenção" :
        userRole === "ACOMPANHAMENTO" ? "Acompanhamento" :
        userRole;

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
                <p className="text-muted-foreground">
                    Visualize e gerencie suas informações pessoais.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Pessoais</CardTitle>
                        <CardDescription>Dados do seu perfil de usuário</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Nome</p>
                                <p className="font-medium">{user.name || "Não informado"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Função</p>
                                <Badge variant={userRole === "ADMIN" ? "destructive" : userRole === "GESTOR" ? "default" : "secondary"}>
                                    {roleLabel}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Informações de Contrato</CardTitle>
                        <CardDescription>Contrato associado ao seu perfil</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {user.contract ? (
                            <div className="flex items-center gap-3">
                                <Building className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Contrato</p>
                                    <p className="font-medium">{user.contract.name}</p>
                                    {user.contract.acronym && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Sigla: {user.contract.acronym}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Building className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Contrato</p>
                                    <p className="font-medium text-muted-foreground">
                                        Acesso Global (sem contrato específico)
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
