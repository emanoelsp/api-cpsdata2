import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

type CPSData = {
  id: string
  tipo: string
  localizacao: string
  status: string
  velocidade: number
  protocolo: string
  temperatura: number
  pressao: number
  dataMedicao: string
}
export async function PUT(request: Request) {
    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, 'cps-data.json')
  
    const newData = await request.json()
  
    // Salva os novos dados no arquivo JSON
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2))
  
    return NextResponse.json(newData, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
export async function GET() {
  const dataDir = path.join(process.cwd(), 'data')
  const filePath = path.join(dataDir, 'cps-data.json')

  // Lê os dados do arquivo JSON
  let cpsData: CPSData[] = []
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    cpsData = JSON.parse(fileContent)
  } else {
    cpsData = [
      {
        id: 'CPS001',
        tipo: 'Sensor',
        localizacao: 'Linha1',
        status: 'Ativo',
        velocidade: 100,
        protocolo: 'MQTT',
        temperatura: 25.0,
        pressao: 1013.25,
        dataMedicao: new Date().toISOString(),
      },
      {
        id: 'CPS002',
        tipo: 'Atuador',
        localizacao: 'Linha2',
        status: 'Inativo',
        velocidade: 0,
        protocolo: 'OPC-UA',
        temperatura: 23.0,
        pressao: 1011.0,
        dataMedicao: new Date().toISOString(),
      },
    ]
    fs.writeFileSync(filePath, JSON.stringify(cpsData, null, 2))
  }

  
  // Atualiza os dados com novos valores de temperatura, pressão e data
 cpsData = cpsData.map((item) => ({
  ...item,
  temperatura: parseFloat((Math.random() * 5 + 20).toFixed(2)), // Garante que o valor seja um número
  pressao: parseFloat((Math.random() * 10 + 1000).toFixed(2)), // Garante que o valor seja um número
  dataMedicao: new Date().toISOString(),
}))


  // Salva os dados atualizados de volta no arquivo JSON
  fs.writeFileSync(filePath, JSON.stringify(cpsData, null, 2))

  return NextResponse.json(cpsData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
