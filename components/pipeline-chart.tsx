"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { name: "Ene", value: 45000 },
  { name: "Feb", value: 52000 },
  { name: "Mar", value: 48000 },
  { name: "Abr", value: 61000 },
  { name: "May", value: 55000 },
  { name: "Jun", value: 67000 },
]

export function PipelineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline de Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              stroke="#FFFFFF" // <-- blanco puro
              tick={{ fill: "#FFFFFF", fontSize: 12 }} // <-- texto blanco
            />
            <YAxis
              className="text-xs"
              stroke="#FFFFFF" // <-- línea del eje
              tick={{ fill: "#FFFFFF", fontSize: 12 }} // <-- texto de los números
            />

            <Tooltip
            contentStyle={{
              backgroundColor: "var(--tooltip-bg)",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
            labelStyle={{
              color: "var(--tooltip-text)",
              transition: "color 0.3s ease",
            }}
            itemStyle={{
              color: "var(--tooltip-text)",
              transition: "color 0.3s ease",
            }}
          />


            <Bar dataKey="value" fill="#4F4F4F" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
