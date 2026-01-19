import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verificando usuários admin existentes...');

  const adminUsers = await prisma.user.findMany({
    where: { role: 'ADMIN' }
  });

  if (adminUsers.length > 0) {
    console.log('✅ Já existem usuários admin:');
    adminUsers.forEach(admin => {
      console.log(`  - ${admin.name || 'Sem nome'} (${admin.email})`);
    });

    console.log('\n📋 Deseja criar outro usuário admin? (pressione Ctrl+C para cancelar)');
  } else {
    console.log('⚠️  Nenhum usuário admin encontrado. Criando usuário padrão...');
  }

  // Criar usuário admin padrão
  const hashedPassword = await bcrypt.hash('admin123', 10);

  try {
    const admin = await prisma.user.create({
      data: {
        email: 'admin@manut.com',
        name: 'Administrador',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('\n✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: admin@manut.com');
    console.log('🔑 Senha: admin123');
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('\n⚠️  O email admin@manut.com já está em uso.');
      console.log('Tentando criar com outro email...');

      const timestamp = Date.now();
      const admin = await prisma.user.create({
        data: {
          email: `admin${timestamp}@manut.com`,
          name: 'Administrador',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });

      console.log('\n✅ Usuário admin criado com sucesso!');
      console.log(`📧 Email: admin${timestamp}@manut.com`);
      console.log('🔑 Senha: admin123');
      console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    } else {
      throw error;
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar usuário admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
