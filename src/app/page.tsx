import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestão de Máquinas</h1>
      <div className="flex gap-4">
        <Link href="/topologia">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Arquitetura de Controle</button>
        </Link>
        <Link href="/gerenciamento">
          <button className="bg-green-500 text-white px-4 py-2 rounded">Gerenciamento de CPS</button>
        </Link>
      </div>
    </div>
  )
}
