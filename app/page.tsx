"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { StatCard } from "@/components/stat-card"
import { RecentActivity } from "@/components/recent-activity"
import { PipelineChart } from "@/components/pipeline-chart"
import { Users, FileText, FileCheck, TrendingUp } from "lucide-react"
import { getClients, getProposals, getContracts } from "@/lib/data-store"
import { initializeData } from "@/lib/init-data"
import type { Client, Proposal, Contract } from "@/lib/types"

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])

  useEffect(() => {
    initializeData()
    setClients(getClients())
    setProposals(getProposals())
    setContracts(getContracts())
  }, [])

  const activeClients = clients.filter((c) => c.status === "active").length
  const totalProposals = proposals.length
  const activeContracts = contracts.filter((c) => c.status === "active").length
  const totalRevenue = contracts.filter((c) => c.status === "active").reduce((sum, c) => sum + c.value, 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
            <p className="text-muted-foreground">Resumen general de tu sistema CRM</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Clientes Activos"
              value={activeClients}
              change="+12% vs mes anterior"
              changeType="positive"
              icon={Users}
            />
            <StatCard
              title="Propuestas"
              value={totalProposals}
              change="3 pendientes de envío"
              changeType="neutral"
              icon={FileText}
              iconColor="bg-chart-3/10 text-chart-3"
            />
            <StatCard
              title="Contratos Activos"
              value={activeContracts}
              change="+2 este mes"
              changeType="positive"
              icon={FileCheck}
              iconColor="bg-accent/10 text-accent"
            />
            <StatCard
              title="Ingresos Totales"
              value={`$${(totalRevenue / 1000).toFixed(0)}K`}
              change="+18% vs mes anterior"
              changeType="positive"
              icon={TrendingUp}
              iconColor="bg-chart-5/10 text-chart-5"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <PipelineChart />
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  )
}
