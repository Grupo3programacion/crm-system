"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ClientDialog } from "@/components/client-dialog"
import { ClientTable } from "@/components/client-table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { getClients, addClient, updateClient, deleteClient } from "@/lib/data-store"
import { initializeData } from "@/lib/init-data"
import type { Client, ClientStatus } from "@/lib/types"

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">("all")

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    initializeData()
    loadClients()
  }, [])

  const loadClients = () => {
    setClients(getClients())
  }

  const handleAddClient = (client: Client) => {
    addClient(client)
    loadClients()
  }

  const handleUpdateClient = (client: Client) => {
    updateClient(client.id, client)
    loadClients()
  }

  const handleDeleteClient = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      deleteClient(id)
      loadClients()
    }
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || client.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Gestión de Clientes</h1>
            <p className="text-muted-foreground">Administra tu cartera de clientes y clientes potenciales</p>
          </div>

          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ClientStatus | "all")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="lead">Clientes Potenciales</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="archived">Archivados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ClientDialog onSave={handleAddClient} />
          </div>

          <ClientTable clients={filteredClients} onUpdate={handleUpdateClient} onDelete={handleDeleteClient} />
        </div>
      </main>
    </div>
  )
}
