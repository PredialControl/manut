import prisma from "@/lib/prisma";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RestoreButtonClient } from "./_components/restore-button-client";

export default async function TrashPage() {
    const deletedContracts = await prisma.contract.findMany({
        where: {
            deleted: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="flex-1 space-y-8 p-8 pt-4">
            <div className="flex items-center justify-end">
                <Link href="/">
                    <Button variant="outline">Voltar ao Portal</Button>
                </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {deletedContracts.map((contract) => (
                    <Card key={contract.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{contract.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground"><strong>Sigla:</strong> {contract.acronym}</p>
                        </CardContent>
                        <CardFooter>
                            <RestoreButtonClient contractId={contract.id} />
                        </CardFooter>
                    </Card>
                ))}
                {deletedContracts.length === 0 && (
                    <p className="text-muted-foreground col-span-full">A lixeira está vazia.</p>
                )}
            </div>
        </div>
    );
} 