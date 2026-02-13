"use client"

import * as React from "react"
import { format, subDays, startOfMonth, endOfMonth, startOfToday } from "date-fns"
import { Calendar as CalendarIcon, ChevronRight, Clock, History } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
    date: DateRange | undefined
    setDate: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {

  const presets = [
    {
      label: "Hoy",
      getValue: () => ({ from: startOfToday(), to: startOfToday() }),
    },
    {
      label: "Últimos 7 días",
      getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }),
    },
    {
      label: "Últimos 30 días",
      getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }),
    },
    {
      label: "Este mes",
      getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }),
    },
    {
      label: "Mes pasado",
      getValue: () => {
        const lastMonth = subDays(startOfMonth(new Date()), 1);
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
      },
    },
  ];

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-fit min-w-[280px] h-11 justify-start text-left font-bold border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all hover:bg-slate-50",
              !date && "text-muted-foreground"
            )}
          >
            <div className="bg-blue-100 p-1.5 rounded-lg mr-3">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest leading-none mb-1">Periodo seleccionado</span>
                <span className="text-sm text-slate-700">
                    {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, "dd MMM")} - {format(date.to, "dd MMM, yyyy")}
                            </>
                        ) : (
                            format(date.from, "dd MMM, yyyy")
                        )
                    ) : (
                        <span>Seleccionar fechas</span>
                    )}
                </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden shadow-2xl border-none ring-1 ring-slate-200/50" align="end">
          <div className="flex flex-col md:flex-row">
             <div className="p-4 bg-slate-50 border-r border-slate-100 w-full md:w-56 space-y-2">
                <div className="flex items-center gap-2 mb-4 px-2">
                    <History className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Atajos</span>
                </div>
                {presets.map((preset) => (
                    <Button
                        key={preset.label}
                        variant="ghost"
                        className="w-full justify-between h-10 text-sm font-bold text-slate-600 hover:bg-white hover:text-blue-600 rounded-xl border-none px-3 group"
                        onClick={() => setDate(preset.getValue())}
                    >
                        {preset.label}
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                ))}
                
                <div className="pt-4 mt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 px-2 text-blue-600/50 font-medium">
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px] uppercase">Rango personalizado abajo</span>
                    </div>
                </div>
             </div>
             <div className="p-2">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    className="p-3"
                />
             </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
