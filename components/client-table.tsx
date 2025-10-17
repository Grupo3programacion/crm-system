//src/components/client-table.tsx

"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Mail } from "lucide-react"
import type { Client } from "@/lib/types"
import { ClientDialog } from "./client-dialog"
import { cn } from "@/lib/utils"

interface ClientTableProps {
  clients: Client[]
  onUpdate: (client: Client) => void
  onDelete: (id: string) => void
}

const statusColors = {
  lead: "bg-chart-3/20 text-chart-3",
  active: "bg-accent/20 text-accent",
  inactive: "bg-muted text-muted-foreground",
  archived: "bg-destructive/20 text-destructive",
}

const statusLabels = {
  lead: "Cliente Potencial",
  active: "Activo",
  inactive: "Inactivo",
  archived: "Archivado",
}

export function ClientTable({ clients, onUpdate, onDelete }: ClientTableProps) {
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Industria</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Último Contacto</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay clientes registrados
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={`mailto:${client.email}`}
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("text-xs", statusColors[client.status])}>
                      {statusLabels[client.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{client.industry || "-"}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(client.value)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(client.lastContact)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingClient(client)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(client.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingClient && (
        <ClientDialog
          client={editingClient}
          onSave={(client) => {
            onUpdate(client)
            setEditingClient(null)
          }}
          trigger={<div />}
        />
      )}
    </>
  )
}
