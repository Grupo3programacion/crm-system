"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  type: "client" | "proposal" | "contract"
  title: string
  description: string
  time: string
  status?: string
}

const activities: Activity[] = [
  {
    id: "1",
    type: "proposal",
    title: "Nueva propuesta enviada",
    description: "Implementación Cloud Infrastructure - TechCorp Solutions",
    time: "Hace 2 horas",
    status: "enviado",
  },
  {
    id: "2",
    type: "client",
    title: "Cliente actualizado",
    description: "Laura Martínez - Digital Plus",
    time: "Hace 5 horas",
    status: "activo",
  },
  {
    id: "3",
    type: "contract",
    title: "Contrato firmado",
    description: "Contrato Marketing Digital 2025 - Digital Plus",
    time: "Hace 1 día",
    status: "activo",
  },
  {
    id: "4",
    type: "client",
    title: "Nuevo lead registrado",
    description: "Carlos Rodríguez - InnovaTech",
    time: "Hace 2 días",
    status: "cliente potencial",
  },
  {
    id: "5",
    type: "proposal",
    title: "Propuesta aceptada",
    description: "Estrategia Marketing Digital 2025 - Digital Plus",
    time: "Hace 3 días",
    status: "acceptado",
  },
]

const getIcon = (type: Activity["type"]) => {
  switch (type) {
    case "client":
      return Users
    case "proposal":
      return FileText
    case "contract":
      return FileCheck
  }
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case "activo":
      return "bg-accent/20 text-accent"
    case "enviado":
      return "bg-primary/20 text-primary"
    case "acceptado":
      return "bg-accent/20 text-accent"
    case "cliente potencial":
      return "bg-chart-3/20 text-chart-3"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getIcon(activity.type)
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="rounded-full bg-muted p-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    {activity.status && (
                      <Badge variant="secondary" className={cn("text-xs", getStatusColor(activity.status))}>
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
