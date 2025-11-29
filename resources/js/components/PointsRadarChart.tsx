"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A radar chart with dots"

interface PointsRadarDotsProps {
  points: Record<string, number>
}

export function PointsRadarDots({ points }: PointsRadarDotsProps) {
  const chartData = Object.entries(points).map(([category, value]) => ({
    category,
    value,
  }))

  const chartConfig = {
    value: {
      label: "Points",
      color: "var(--color-desktop)",
    },
  } satisfies ChartConfig

  return (
    <Card className="w-full rounded-xl">
      <CardHeader className="items-center">
        <CardTitle>My Points</CardTitle>
        <CardDescription>
          Showing my current progress in all categories
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0 w-full">
        <ChartContainer config={chartConfig} className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="category" />
              <PolarGrid />
              <Radar
                dataKey="value"
                fill="var(--color-primary)"
                fillOpacity={0.6}
                dot={{ r: 4, fillOpacity: 1 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Keep progressing! <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
