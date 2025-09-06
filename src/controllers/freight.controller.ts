import { Request, Response } from 'express'
import axios from 'axios'

export const calculateFreight = async (req: Request, res: Response) => {
  const { cep } = req.body as { cep: string }

  if (!cep) {
    return res.status(400).json({ error: 'CEP é obrigatório' })
  }

  try {
    // Consulta ViaCEP para pegar o UF do cliente
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    const uf = response.data.uf

    // Tabela de frete com base na origem sendo SP
    const freightTable: Record<string, number> = {
      SP: 14.9,
      RJ: 19.9,
      MG: 22.9,
      PR: 24.9,
      RS: 26.9,
      SC: 26.9,
      ES: 23.9,
      BA: 27.9,
      PE: 29.9,
      AM: 34.9,
      OUTROS: 32.9,
    }

    const freightValue = freightTable[uf as keyof typeof freightTable] ?? freightTable.OUTROS

    return res.status(200).json({ freight: freightValue.toFixed(2) })
  } catch (error) {
    console.error('Erro ao calcular frete:', error)
    return res.status(500).json({ error: 'Erro ao calcular o frete' })
  }
}
