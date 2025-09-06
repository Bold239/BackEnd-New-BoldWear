import { User } from '../models/user.model'

export const createDefaultAdmin = async (): Promise<void> => {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.warn('⚠️ ADMIN_EMAIL ou ADMIN_PASSWORD não definidos no .env')
    return
  }

  const existingAdmin = await User.findOne({ where: { email } })

  if (existingAdmin) {
    console.log(`ℹ️ Conta admin padrão já existe: ${email}`)
    return
  }

  await User.create({
    name: "BoldWearADM",
    email,
    password,
    role: 'admin',
  })

  console.log(`✅ Conta admin padrão criada: ${email}`)
}
