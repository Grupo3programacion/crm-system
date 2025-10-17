"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, FileText } from "lucide-react"
import type { Contract } from "@/lib/types"
import { ContractDialog } from "./contract-dialog"
import { getClients } from "@/lib/data-store"
import { cn } from "@/lib/utils"

interface ContractTableProps {
  contracts: Contract[]
  onUpdate: (contract: Contract) => void
  onDelete: (id: string) => void
}

const statusColors = {
  pending: "bg-chart-3/20 text-chart-3",
  active: "bg-accent/20 text-accent",
  completed: "bg-primary/20 text-primary",
  cancelled: "bg-destructive/20 text-destructive",
}

const statusLabels = {
  pending: "Pendiente",
  active: "Activo",
  completed: "Completado",
  cancelled: "Cancelado",
}

export function ContractTable({ contracts, onUpdate, onDelete }: ContractTableProps) {
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
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

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contrato</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Días Restantes</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No hay contratos registrados
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract) => {
                const daysRemaining = getDaysRemaining(contract.endDate)
                return (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">{contract.title}</p>
                          {contract.terms && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{contract.terms}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{clientMap[contract.clientId] || "N/A"}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(contract.value)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs", statusColors[contract.status])}>
                        {statusLabels[contract.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(contract.startDate)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(contract.endDate)}</TableCell>
                    <TableCell>
                      {contract.status === "active" && (
                        <span
                          className={cn(
                            "text-sm font-medium",
                            daysRemaining < 30 ? "text-destructive" : "text-muted-foreground",
                          )}
                        >
                          {daysRemaining > 0 ? `${daysRemaining} días` : "Vencido"}
                        </span>
                      )}
                      {contract.status !== "active" && <span className="text-sm text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingContract(contract)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(contract.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {editingContract && (
        <ContractDialog
          contract={editingContract}
          onSave={(contract) => {
            onUpdate(contract)
            setEditingContract(null)
          }}
          trigger={<div />}
        />
      )}
    </>
  )
}
