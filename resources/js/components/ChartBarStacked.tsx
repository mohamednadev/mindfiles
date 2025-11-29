/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { TrendingUp } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function ChartBarStacked({ data }: { data: any[] }) {
  console.log("Chart data:", data);
  const chartConfig = {
    done: { label: "Done", color: "var(--color-primary)" },
    overdue: { label: "Overdue", color: "var(--color-destructive)" },
  }

  return (
    <Card className="w-full h-full rounded-xl">
      <CardHeader>
        <CardTitle>Tasks by Category</CardTitle>
        <CardDescription>Your performance across task categories</CardDescription>
      </CardHeader>

      <CardContent className="mt-14">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />

            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />

            <Bar
              dataKey="done"
              stackId="a"
              fill="var(--color-done)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="overdue"
              stackId="a"
              fill="var(--color-overdue)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none m-auto">
          My performance <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
