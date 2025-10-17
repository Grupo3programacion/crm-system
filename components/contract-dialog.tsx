"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Contract, ContractStatus } from "@/lib/types"
import { Plus } from "lucide-react"
import { getClients, getProposals } from "@/lib/data-store"

interface ContractDialogProps {
  contract?: Contract
  onSave: (contract: Contract) => void
  trigger?: React.ReactNode
}

export function ContractDialog({ contract, onSave, trigger }: ContractDialogProps) {
  const [open, setOpen] = useState(false)
  const [clients, setClients] = useState<Array<{ id: string; name: string; company: string }>>([])
  const [proposals, setProposals] = useState<Array<{ id: string; title: string; clientId: string }>>([])
  const [formData, setFormData] = useState<Partial<Contract>>(
    contract || {
      clientId: "",
      proposalId: "",
      title: "",
      value: 0,
      status: "pending",
      startDate: "",
      endDate: "",
      terms: "",
    },
  )

  useEffect(() => {
    const clientList = getClients()
    setClients(clientList.map((c) => ({ id: c.id, name: c.name, company: c.company })))

    const proposalList = getProposals()
    setProposals(proposalList.map((p) => ({ id: p.id, title: p.title, clientId: p.clientId })))
  }, [])

  const filteredProposals = proposals.filter((p) => !formData.clientId || p.clientId === formData.clientId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newContract: Contract = {
      id: contract?.id || Date.now().toString(),
      clientId: formData.clientId || "",
      proposalId: formData.proposalId,
      title: formData.title || "",
      value: formData.value || 0,
      status: (formData.status as ContractStatus) || "pending",
      startDate: formData.startDate || "",
      endDate: formData.endDate || "",
      createdAt: contract?.createdAt || new Date().toISOString(),
      terms: formData.terms,
      signedAt: formData.status === "active" && !contract?.signedAt ? new Date().toISOString() : contract?.signedAt,
    }
    onSave(newContract)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Contrato
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{contract ? "Editar Contrato" : "Nuevo Contrato"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value, proposalId: "" })}
              >
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="proposalId">Propuesta (opcional)</Label>
              <Select
                value={formData.proposalId}
                onValueChange={(value) => setFormData({ ...formData, proposalId: value })}
                disabled={!formData.clientId}
              >
                <SelectTrigger id="proposalId">
                  <SelectValue placeholder="Seleccionar propuesta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguna</SelectItem>
                  {filteredProposals.map((proposal) => (
                    <SelectItem key={proposal.id} value={proposal.id}>
                      {proposal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Título del Contrato *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">($) Valor  *</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as ContractStatus })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de Inicio *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate?.split("T")[0]}
                onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value).toISOString() })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de Fin *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate?.split("T")[0]}
                onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value).toISOString() })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="terms">Términos y Condiciones</Label>
            <Textarea
              id="terms"
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              rows={4}
              placeholder="Describe los términos del contrato, condiciones de pago, entregables, etc."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
