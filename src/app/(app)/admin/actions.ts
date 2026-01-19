"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// Verificar se o usuário é admin
async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        throw new Error("Acesso negado. Apenas administradores.");
    }
}

export async function createUser(data: any) {
    await checkAdmin();

    const { name, email, password, role, contractId } = data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { success: false, error: "Usuário já existe com este e-mail." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || "USER",
            contractId: contractId || null,
        },
    });

    revalidatePath("/admin/users");
    return { success: true };
}

export async function updateUser(id: string, data: any) {
    await checkAdmin();

    const { name, email, role, contractId, password } = data;

    // Verifica se o email já existe em outro usuário
    const existingUser = await prisma.user.findFirst({
        where: {
            email,
            NOT: { id }
        }
    });

    if (existingUser) {
        return { success: false, error: "Já existe outro usuário com este e-mail." };
    }

    const updateData: any = {
        name,
        email,
        role,
        contractId: contractId || null,
    };

    if (password && password.trim() !== "") {
        updateData.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
        where: { id },
        data: updateData,
    });

    revalidatePath("/admin/users");
    return { success: true };
}

export async function deleteUser(id: string) {
    await checkAdmin();

    await prisma.user.delete({
        where: { id },
    });

    revalidatePath("/admin/users");
}
