"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ProposalDialog } from "@/components/proposal-dialog"
import { ProposalTable } from "@/components/proposal-table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { getProposals, addProposal, updateProposal, deleteProposal, getClients } from "@/lib/data-store"
import { initializeData } from "@/lib/init-data"
import type { Proposal, ProposalStatus } from "@/lib/types"

export default function PropuestasPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | "all">("all")

  useEffect(() => {
    initializeData()
    loadProposals()
  }, [])

  const loadProposals = () => {
    setProposals(getProposals())
  }

  const handleAddProposal = (proposal: Proposal) => {
    addProposal(proposal)
    loadProposals()
  }

  const handleUpdateProposal = (proposal: Proposal) => {
    updateProposal(proposal.id, proposal)
    loadProposals()
  }

  const handleDeleteProposal = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta propuesta?")) {
      deleteProposal(id)
      loadProposals()
    }
  }

  const filteredProposals = proposals.filter((proposal) => {
    const clients = getClients()
    const client = clients.find((c) => c.id === proposal.clientId)
    const clientName = client ? `${client.name} ${client.company}` : ""

    const matchesSearch =
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Gestión de Propuestas</h1>
            <p className="text-muted-foreground">Crea y gestiona propuestas comerciales para tus clientes</p>
          </div>

          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar propuestas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ProposalStatus | "all")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="draft">Borradores</SelectItem>
                  <SelectItem value="sent">Enviadas</SelectItem>
                  <SelectItem value="viewed">Vistas</SelectItem>
                  <SelectItem value="accepted">Aceptadas</SelectItem>
                  <SelectItem value="rejected">Rechazadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ProposalDialog onSave={handleAddProposal} />
          </div>

          <ProposalTable
            proposals={filteredProposals}
            onUpdate={handleUpdateProposal}
            onDelete={handleDeleteProposal}
          />
        </div>
      </main>
    </div>
  )
}
