"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ContractDialog } from "@/components/contract-dialog"
import { ContractTable } from "@/components/contract-table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { getContracts, addContract, updateContract, deleteContract, getClients } from "@/lib/data-store"
import { initializeData } from "@/lib/init-data"
import type { Contract, ContractStatus } from "@/lib/types"

export default function ContratosPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all")

  useEffect(() => {
    initializeData()
    loadContracts()
  }, [])

  const loadContracts = () => {
    setContracts(getContracts())
  }

  const handleAddContract = (contract: Contract) => {
    addContract(contract)
    loadContracts()
  }

  const handleUpdateContract = (contract: Contract) => {
    updateContract(contract.id, contract)
    loadContracts()
  }

  const handleDeleteContract = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este contrato?")) {
      deleteContract(id)
      loadContracts()
    }
  }

  const filteredContracts = contracts.filter((contract) => {
    const clients = getClients()
    const client = clients.find((c) => c.id === contract.clientId)
    const clientName = client ? `${client.name} ${client.company}` : ""

    const matchesSearch =
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contract.terms && contract.terms.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || contract.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Gestión de Contratos</h1>
            <p className="text-muted-foreground">Administra contratos activos y su seguimiento</p>
          </div>

          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar contratos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ContractStatus | "all")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ContractDialog onSave={handleAddContract} />
          </div>

          <ContractTable
            contracts={filteredContracts}
            onUpdate={handleUpdateContract}
            onDelete={handleDeleteContract}
          />
        </div>
      </main>
    </div>
  )
}
