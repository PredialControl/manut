"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contract } from "@prisma/client";
import { DeleteContractDialog } from "./delete-contract-dialog";
import { EditContractDialog } from "./edit-contract-dialog";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface ContractCardProps {
    contract: Contract & {
        constructionItems?: Array<{
            id: string;
            status: string;
        }>;
    };
}

export function ContractCard({ contract }: ContractCardProps) {
    // Usar a imagem salva no banco de dados ou fallback para placeholder
    const getImageUrl = (contract: Contract) => {
        if (contract.imageUrl) {
            return contract.imageUrl;
        }
        // Fallback para detecção automática (mantido para compatibilidade)
        if (contract.name.toLowerCase().includes('living one')) {
            return "/living-one-building.svg";
        }
        return "/placeholder-building.svg";
    };

    const imageUrl = getImageUrl(contract);

    // Calcular estatísticas de chamados
    const items = contract.constructionItems || [];
    const totalItems = items.length;
    const openItems = items.filter(item =>
        ['EM_ANDAMENTO', 'AGUARDANDO_VISTORIA'].includes(item.status)
    ).length;
    const finishedItems = items.filter(item =>
        item.status === 'FINALIZADO'
    ).length;

    // Função para obter a cor do badge baseada no status
    const getStatusBadge = (status: string | null) => {
        if (!status) return null;

        const statusConfig = {
            'Implantado': { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
            'Em implantação': { variant: 'default' as const, className: 'bg-yellow-100 text-yellow-800' },
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        if (!config) return null;

        return (
            <Badge variant={config.variant} className={config.className}>
                {status}
            </Badge>
        );
    };

    return (
        <Card className="group flex flex-col hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-500 overflow-hidden border-border/50 bg-card p-0 gap-0">
            {/* Card Header with Image Overlay */}
            <div className="relative h-48 w-full bg-secondary/30 overflow-hidden group-hover:bg-secondary/40 transition-colors duration-500">
                <div className="absolute inset-0 flex items-center justify-center p-6">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={`Imagem do ${contract.name}`}
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40">
                            <span className="text-4xl">🏢</span>
                            <span className="text-xs mt-2 uppercase tracking-widest font-bold">Sem Foto</span>
                        </div>
                    )}
                </div>

                {/* Status Badge Positioned absolutely */}
                <div className="absolute top-4 right-4">
                    {getStatusBadge(contract.status) || <Badge variant="secondary" className="bg-muted/50 text-muted-foreground">Pendente</Badge>}
                </div>

                {/* ID Badge */}
                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-border/50 shadow-sm">
                    <span className="text-[10px] font-mono font-bold text-primary">{contract.acronym || 'CON-00'}</span>
                </div>
            </div>

            <CardContent className="flex-grow p-6 space-y-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {contract.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        {contract.address || 'Endereço não informado'}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Síndico</span>
                        <p className="text-sm font-medium text-foreground truncate">{contract.sindico || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">CNPJ</span>
                        <p className="text-sm font-medium text-foreground font-mono text-[11px]">{contract.cnpj || 'Verificar'}</p>
                    </div>
                </div>

                {/* Resumo de Chamados */}
                {totalItems > 0 && (
                    <div className="pt-3 border-t border-border/50">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground block mb-2">Chamados</span>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/30">
                                <CheckCircle2 className="h-4 w-4 text-muted-foreground mb-1" />
                                <span className="text-lg font-bold text-foreground">{totalItems}</span>
                                <span className="text-[9px] text-muted-foreground uppercase">Total</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-500/10">
                                <Clock className="h-4 w-4 text-blue-600 mb-1" />
                                <span className="text-lg font-bold text-blue-600">{openItems}</span>
                                <span className="text-[9px] text-blue-600/70 uppercase">Abertos</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-green-500/10">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mb-1" />
                                <span className="text-lg font-bold text-green-600">{finishedItems}</span>
                                <span className="text-[9px] text-green-600/70 uppercase">Finalizados</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 pt-4">
                    <Link href={`/assets?contractId=${contract.id}`} className="flex-1">
                        <Button className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 group/btn overflow-hidden relative">
                            <span className="relative z-10">Acessar Unidade</span>
                        </Button>
                    </Link>
                    <div className="flex gap-2">
                        <EditContractDialog contract={contract} />
                        <DeleteContractDialog contractId={contract.id} contractName={contract.name} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 