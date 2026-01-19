"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createUser, updateUser } from "../../actions";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";

interface UserDialogProps {
    user?: any;
    contracts: any[];
}

export function UserDialog({ user, contracts }: UserDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        role: user?.role || "USER",
        contractId: user?.contractId || "none",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSubmit = { ...formData };
            if (dataToSubmit.contractId === "none") {
                dataToSubmit.contractId = null;
            }

            if (user) {
                // Edit
                const res = await updateUser(user.id, dataToSubmit);
                if (!res.success && res.error) throw new Error(res.error);
                toast.success("Usuário atualizado com sucesso!");
            } else {
                // Create
                if (!dataToSubmit.password) {
                    toast.error("Para cadastrar novo usuário, crie uma senha inicial.");
                    setLoading(false);
                    return;
                }
                const res = await createUser(dataToSubmit);
                if (!res.success && res.error) throw new Error(res.error);
                toast.success("Usuário criado com sucesso!");
            }
            setOpen(false);
            if (!user) setFormData({ name: "", email: "", password: "", role: "USER", contractId: "none" }); // Reset form only on create
        } catch (err: any) {
            toast.error(err.message || "Erro ao salvar usuário.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {user ? (
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Novo Usuário
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{user ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
                    <DialogDescription>
                        {user
                            ? "Edite as informações do usuário aqui."
                            : "Preencha os dados para criar um novo usuário."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Senha
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="col-span-3"
                            placeholder={user ? "Deixe em branco para manter" : "Senha forte"}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Função
                        </Label>
                        <Select
                            value={formData.role}
                            onValueChange={(val) => setFormData({ ...formData, role: val })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADMIN">Administrador</SelectItem>
                                <SelectItem value="GESTOR">Gestor</SelectItem>
                                <SelectItem value="MANUTENCAO">Manutenção</SelectItem>
                                <SelectItem value="ACOMPANHAMENTO">Acompanhamento</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="contract" className="text-right">
                            Contrato
                        </Label>
                        <Select
                            value={formData.contractId || "none"}
                            onValueChange={(val) => setFormData({ ...formData, contractId: val })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione o contrato..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Nenhum (Global)</SelectItem>
                                {contracts.map((contract) => (
                                    <SelectItem key={contract.id} value={contract.id}>
                                        {contract.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
