"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Proposal, ProposalStatus, Priority, ProposalItem } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"
import { getClients } from "@/lib/data-store"

interface ProposalDialogProps {
  proposal?: Proposal
  onSave: (proposal: Proposal) => void
  trigger?: React.ReactNode
}

export function ProposalDialog({ proposal, onSave, trigger }: ProposalDialogProps) {
  const [open, setOpen] = useState(false)
  const [clients, setClients] = useState<Array<{ id: string; name: string; company: string }>>([])
  const [formData, setFormData] = useState<Partial<Proposal>>(
    proposal || {
      clientId: "",
      title: "",
      description: "",
      value: 0,
      status: "draft",
      priority: "medium",
      validUntil: "",
      items: [],
    },
  )

  useEffect(() => {
    const clientList = getClients()
    setClients(clientList.map((c) => ({ id: c.id, name: c.name, company: c.company })))
  }, [])

  const addItem = () => {
    const newItem: ProposalItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    setFormData({
      ...formData,
      items: [...(formData.items || []), newItem],
    })
  }

  const updateItem = (id: string, field: keyof ProposalItem, value: string | number) => {
    const items = formData.items?.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        if (field === "quantity" || field === "unitPrice") {
          updated.total = updated.quantity * updated.unitPrice
        }
        return updated
      }
      return item
    })
    const totalValue = items?.reduce((sum, item) => sum + item.total, 0) || 0
    setFormData({ ...formData, items, value: totalValue })
  }

  const removeItem = (id: string) => {
    const items = formData.items?.filter((item) => item.id !== id)
    const totalValue = items?.reduce((sum, item) => sum + item.total, 0) || 0
    setFormData({ ...formData, items, value: totalValue })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newProposal: Proposal = {
      id: proposal?.id || Date.now().toString(),
      clientId: formData.clientId || "",
      title: formData.title || "",
      description: formData.description || "",
      value: formData.value || 0,
      status: (formData.status as ProposalStatus) || "draft",
      priority: (formData.priority as Priority) || "medium",
      validUntil: formData.validUntil || "",
      createdAt: proposal?.createdAt || new Date().toISOString(),
      items: formData.items || [],
    }
    onSave(newProposal)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Propuesta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{proposal ? "Editar Propuesta" : "Nueva Propuesta"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
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
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as ProposalStatus })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="sent">Enviada</SelectItem>
                  <SelectItem value="viewed">Vista</SelectItem>
                  <SelectItem value="accepted">Aceptada</SelectItem>
                  <SelectItem value="rejected">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as Priority })}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil">Válida hasta *</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil?.split("T")[0]}
                onChange={(e) => setFormData({ ...formData, validUntil: new Date(e.target.value).toISOString() })}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Ítems de la Propuesta</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Ítem
              </Button>
            </div>

            {formData.items && formData.items.length > 0 && (
              <div className="space-y-3">
                {formData.items.map((item) => (
                  <div key={item.id} className="grid gap-3 p-4 border border-border rounded-lg md:grid-cols-12">
                    <div className="md:col-span-5">
                      <Input
                        placeholder="Descripción"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        type="number"
                        placeholder="Cantidad"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        type="number"
                        placeholder="Precio"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input value={`$${item.total.toFixed(2)}`} disabled />
                    </div>
                    <div className="md:col-span-1 flex items-center">
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end p-4 bg-muted rounded-lg">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">${formData.value?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
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
