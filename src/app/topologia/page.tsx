'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Smartphone, Monitor } from 'lucide-react'

const MachineDetails = dynamic(() => import('../components/machinedetails'), {
  ssr: false,
})

export interface CPSData {
  id: string
  tipo: string
  localizacao: string
  status: string
  velocidade: number
  protocolo: string
  temperatura: string
  pressao: string
  dataMedicao: string
}

export default function Topologia() {
  const [cpsData, setCpsData] = useState<CPSData[]>([])
  const [selectedMachine, setSelectedMachine] = useState<CPSData | null>(null)

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/cps-data')
      const data = await response.json()
      setCpsData(data)
    }

    // Atualiza os dados a cada 1 minuto
    fetchData()
    const interval = setInterval(fetchData, 60000)

    return () => clearInterval(interval)
  }, [])

  const groupedByLocation = cpsData.reduce((acc, cps) => {
    if (!acc[cps.localizacao]) {
      acc[cps.localizacao] = []
    }
    acc[cps.localizacao].push(cps)
    return acc
  }, {} as Record<string, CPSData[]>)

  const handleMachineClick = (machine: CPSData) => {
    setSelectedMachine(machine)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"> ARQUITETURA DE CONTROLE - Topologia de Máquinas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedByLocation).map(([location, machines]) => (
          <div key={location} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Localização: {location}</h2>
            <div className="flex flex-wrap gap-6 mt-4 justify-center">
              {machines.map((machine) => (
                <div
                  key={machine.id}
                  className="relative cursor-pointer"
                  onClick={() => handleMachineClick(machine)}
                >
                  {machine.tipo === 'Sensor' ? (
                    <Smartphone className="h-12 w-12 text-blue-500" />
                  ) : (
                    <Monitor className="h-12 w-12 text-green-500" />
                  )}
                  <p className="mt-2 text-center">{machine.id}</p>
                  <p className="text-center text-sm text-gray-500">
                    Temp: {machine.temperatura}°C | Press: {machine.pressao} hPa
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedMachine && <MachineDetails machine={selectedMachine} />}
    </div>
  )
}
