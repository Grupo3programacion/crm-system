"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Download, Upload } from "lucide-react"
import { saveClients, saveProposals, saveContracts, getClients, getProposals, getContracts } from "@/lib/data-store"
import { mockClients, mockProposals, mockContracts } from "@/lib/mock-data"

export default function ConfiguracionPage() {
  const handleResetData = () => {
    if (confirm("¿Estás seguro de que deseas restablecer todos los datos? Esta acción no se puede deshacer.")) {
      saveClients(mockClients)
      saveProposals(mockProposals)
      saveContracts(mockContracts)
      alert("Datos restablecidos correctamente")
      window.location.reload()
    }
  }

  const handleClearData = () => {
    if (
      confirm(
        "¿Estás seguro de que deseas eliminar TODOS los datos? Esta acción no se puede deshacer y perderás toda la información.",
      )
    ) {
      saveClients([])
      saveProposals([])
      saveContracts([])
      alert("Todos los datos han sido eliminados")
      window.location.reload()
    }
  }

  const handleExportData = () => {
    const data = {
      clients: getClients(),
      proposals: getProposals(),
      contracts: getContracts(),
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `crm-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string)
            if (data.clients) saveClients(data.clients)
            if (data.proposals) saveProposals(data.proposals)
            if (data.contracts) saveContracts(data.contracts)
            alert("Datos importados correctamente")
            window.location.reload()
          } catch (error) {
            alert("Error al importar los datos. Verifica que el archivo sea válido.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Configuración</h1>
            <p className="text-muted-foreground">Gestiona la configuración del sistema</p>
          </div>

          <div className="grid gap-6 max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Datos</CardTitle>
                <CardDescription>Exporta, importa o restablece los datos del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Exportar Datos</p>
                    <p className="text-sm text-muted-foreground">Descarga una copia de seguridad de todos tus datos</p>
                  </div>
                  <Button onClick={handleExportData} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Importar Datos</p>
                    <p className="text-sm text-muted-foreground">Restaura datos desde un archivo de respaldo</p>
                  </div>
                  <Button onClick={handleImportData} variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Importar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Restablecer Datos de Ejemplo</p>
                    <p className="text-sm text-muted-foreground">Restaura los datos de ejemplo iniciales</p>
                  </div>
                  <Button onClick={handleResetData} variant="outline">
                    Restablecer
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-destructive rounded-lg bg-destructive/5">
                  <div>
                    <p className="font-medium text-destructive">Eliminar Todos los Datos</p>
                    <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer</p>
                  </div>
                  <Button onClick={handleClearData} variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar Todo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información del Sistema</CardTitle>
                <CardDescription>Detalles sobre el almacenamiento de datos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Almacenamiento:</span>
                    <span className="font-medium">LocalStorage (navegador)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clientes registrados:</span>
                    <span className="font-medium">{getClients().length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Propuestas creadas:</span>
                    <span className="font-medium">{getProposals().length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contratos activos:</span>
                    <span className="font-medium">{getContracts().filter((c) => c.status === "active").length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
