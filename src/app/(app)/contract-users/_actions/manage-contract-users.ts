"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// Verificar se o usuário é GESTOR do contrato
async function checkGestor(contractId: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("Acesso negado. Faça login.");
    }
    
    const userRole = session.user.role;
    const userContractId = (session.user as any)?.contractId;

    // ADMIN pode fazer tudo
    if (userRole === "ADMIN") {
        return;
    }

    // GESTOR só pode gerenciar usuários do seu próprio contrato
    if (userRole !== "GESTOR" || userContractId !== contractId) {
        throw new Error("Acesso negado. Apenas gestores podem gerenciar usuários do próprio contrato.");
    }
}

export async function createContractUser(contractId: string, data: any) {
    await checkGestor(contractId);

    const { name, email, password, role } = data;

    // GESTOR não pode criar ADMIN
    if (role === "ADMIN") {
        return { error: "Gestores não podem criar usuários administradores." };
    }

    // Obrigar que o usuário seja do contrato do gestor
    if (role === "GESTOR") {
        return { error: "Gestores não podem criar outros gestores. Use a área de administração." };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "Usuário já existe com este e-mail." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || "MANUTENCAO",
            contractId: contractId, // Sempre do contrato do gestor
        },
    });

    revalidatePath(`/contract-users?contractId=${contractId}`);
    return { success: true };
}

export async function updateContractUser(contractId: string, userId: string, data: any) {
    await checkGestor(contractId);

    // Verificar se o usuário pertence ao contrato
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user || user.contractId !== contractId) {
        return { error: "Usuário não encontrado ou não pertence a este contrato." };
    }

    // GESTOR não pode alterar role para ADMIN
    if (data.role === "ADMIN") {
        return { error: "Não é permitido alterar para Administrador." };
    }

    const { name, email, role, password } = data;

    const updateData: any = {
        name,
        email,
        role,
        // contractId não pode ser alterado - sempre do contrato do gestor
    };

    if (password && password.trim() !== "") {
        updateData.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
        where: { id: userId },
        data: updateData,
    });

    revalidatePath(`/contract-users?contractId=${contractId}`);
    return { success: true };
}

export async function deleteContractUser(contractId: string, userId: string) {
    await checkGestor(contractId);

    // Verificar se o usuário pertence ao contrato
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user || user.contractId !== contractId) {
        return { error: "Usuário não encontrado ou não pertence a este contrato." };
    }

    // GESTOR não pode deletar outros GESTOR ou ADMIN
    if (user.role === "ADMIN" || user.role === "GESTOR") {
        return { error: "Não é permitido deletar este tipo de usuário." };
    }

    await prisma.user.delete({
        where: { id: userId },
    });

    revalidatePath(`/contract-users?contractId=${contractId}`);
    return { success: true };
}
