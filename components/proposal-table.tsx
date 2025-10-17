"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import type { Proposal } from "@/lib/types"
import { ProposalDialog } from "./proposal-dialog"
import { getClients } from "@/lib/data-store"
import { cn } from "@/lib/utils"

interface ProposalTableProps {
  proposals: Proposal[]
  onUpdate: (proposal: Proposal) => void
  onDelete: (id: string) => void
}

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-primary/20 text-primary",
  viewed: "bg-chart-3/20 text-chart-3",
  accepted: "bg-accent/20 text-accent",
  rejected: "bg-destructive/20 text-destructive",
}

const statusLabels = {
  draft: "Borrador",
  sent: "Enviada",
  viewed: "Vista",
  accepted: "Aceptada",
  rejected: "Rechazada",
}

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-chart-3/20 text-chart-3",
  high: "bg-destructive/20 text-destructive",
}

const priorityLabels = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
}

export function ProposalTable({ proposals, onUpdate, onDelete }: ProposalTableProps) {
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null)
  const [clientMap, setClientMap] = useState<Record<string, string>>({})

  useEffect(() => {
    const clients = getClients()
    const map = clients.reduce(
      (acc, client) => {
        acc[client.id] = `${client.name} - ${client.company}`
        return acc
      },
      {} as Record<string, string>,
    )
    setClientMap(map)
  }, [])

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
              <TableHead>Título</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Válida hasta</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay propuestas registradas
                </TableCell>
              </TableRow>
            ) : (
              proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{proposal.title}</p>
                      {proposal.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{proposal.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{clientMap[proposal.clientId] || "N/A"}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(proposal.value)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("text-xs", statusColors[proposal.status])}>
                      {statusLabels[proposal.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("text-xs", priorityColors[proposal.priority])}>
                      {priorityLabels[proposal.priority]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(proposal.validUntil)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingProposal(proposal)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(proposal.id)} className="text-destructive">
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

      {editingProposal && (
        <ProposalDialog
          proposal={editingProposal}
          onSave={(proposal) => {
            onUpdate(proposal)
            setEditingProposal(null)
          }}
          trigger={<div />}
        />
      )}
    </>
  )
}
