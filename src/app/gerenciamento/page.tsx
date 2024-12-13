// /app/gerenciamento/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

interface CPSData {
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

const Gerenciamento: React.FC = () => {
  const [cpsData, setCpsData] = useState<CPSData[]>([])
  const { register, handleSubmit, setValue } = useForm<CPSData>()
  const [editingMachine, setEditingMachine] = useState<CPSData | null>(null)
  const router = useRouter()

  // Função para carregar os dados do cps-data.json
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/cps-data')
      const data = await response.json()
      setCpsData(data)
    }
    fetchData()
  }, [])

  // Função para salvar os dados alterados
  async function saveData(newData: CPSData[]) {
    await fetch('/api/cps-data', {
      method: 'PUT',
      body: JSON.stringify(newData),
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Função para editar uma máquina
  const handleEdit = (machine: CPSData) => {
    setEditingMachine(machine)
    // Preenche o formulário com os dados da máquina
    setValue('id', machine.id)
    setValue('tipo', machine.tipo)
    setValue('localizacao', machine.localizacao)
    setValue('status', machine.status)
    setValue('velocidade', machine.velocidade)
    setValue('protocolo', machine.protocolo)
    setValue('temperatura', machine.temperatura)
    setValue('pressao', machine.pressao)
    setValue('dataMedicao', machine.dataMedicao)
  }

  // Função de enviar o formulário
  const onSubmit = async (data: CPSData) => {
    const updatedCpsData = cpsData.map((machine) =>
      machine.id === data.id ? { ...machine, ...data } : machine
    )
    await saveData(updatedCpsData)
    router.push('/') // Redireciona para a página inicial
  }

  // Função para adicionar uma nova máquina
  const handleAdd = async (data: CPSData) => {
    const newCpsData = [...cpsData, { ...data, dataMedicao: new Date().toISOString() }]
    await saveData(newCpsData)
    router.push('/') // Redireciona para a página inicial
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de CPS</h1>

      <form
        onSubmit={handleSubmit((data) => {
          if (editingMachine) {
            onSubmit(data)
          } else {
            handleAdd(data)
          }
        })}
        className="space-y-4"
      >
        <div>
          <label className="block font-semibold">ID</label>
          <input
            {...register('id', { required: true })}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={editingMachine !== null}
          />
        </div>

        <div>
          <label className="block font-semibold">Tipo</label>
          <input {...register('tipo', { required: true })} className="w-full p-2 border border-gray-300 rounded" />
        </div>

        <div>
          <label className="block font-semibold">Localização</label>
          <input {...register('localizacao', { required: true })} className="w-full p-2 border border-gray-300 rounded" />
        </div>

        <div>
          <label className="block font-semibold">Status</label>
          <input {...register('status', { required: true })} className="w-full p-2 border border-gray-300 rounded" />
        </div>

        <div>
          <label className="block font-semibold">Velocidade</label>
          <input {...register('velocidade', { required: true })} type="number" className="w-full p-2 border border-gray-300 rounded" />
        </div>

        <div>
          <label className="block font-semibold">Protocolo</label>
          <input {...register('protocolo', { required: true })} className="w-full p-2 border border-gray-300 rounded" />
        </div>

        <div>
          <label className="block font-semibold">Temperatura</label>
          <input {...register('temperatura', { required: true })} type="text" className="w-full p-2 border border-gray-300 rounded" />
        </div>

        <div>
          <label className="block font-semibold">Pressão</label>
          <input {...register('pressao', { required: true })} type="text" className="w-full p-2 border border-gray-300 rounded" />
        </div>

        <div>
          <label className="block font-semibold">Data de Medição</label>
          <input
            {...register('dataMedicao', { required: true })}
            type="datetime-local"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingMachine ? 'Salvar Alterações' : 'Adicionar Máquina'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8">Máquinas Cadastradas</h2>
      <ul className="mt-4">
        {cpsData.map((machine) => (
          <li key={machine.id} className="border-b py-2">
            <div className="flex justify-between">
              <span>{machine.id} - {machine.tipo}</span>
              <button
                onClick={() => handleEdit(machine)}
                className="text-blue-500"
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Gerenciamento
