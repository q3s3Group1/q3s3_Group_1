"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { MoldHistory } from "@/types/supabase"
import Link from "next/link"
import { DateRange } from "react-day-picker"
import { useLanguage } from "@/lib/i18n/LanguageContext"

// Props
interface MoldHistoryProps {
  moldsHistory: MoldHistory[]
  setRange?: (range: DateRange) => void
  showMold?: boolean
  showMachine?: boolean
  setBoardPort?: (boardPort: { board: number; port: number }) => void
}

export const MoldHistoryTable = ({
  moldsHistory,
  setRange,
  showMold,
  showMachine,
  setBoardPort,
}: MoldHistoryProps) => {
  const { t } = useLanguage()

  return (
    <Table>
      <TableCaption>{t("molds.historyTableTitle")}</TableCaption>

      <TableHeader>
        <TableRow>
          {showMold && <TableHead>{t("molds.mold")}</TableHead>}
          {showMachine && <TableHead>{t("machines.machine")}</TableHead>}
          <TableHead>{t("general.start")}</TableHead>
          <TableHead>{t("general.end")}</TableHead>
          <TableHead>{t("molds.shots")}</TableHead>
          {setRange && <TableHead>{t("general.viewData")}</TableHead>}
        </TableRow>
      </TableHeader>

      <TableBody>
        {moldsHistory.map((moldHistory) => (
          <TableRow key={moldHistory.mold_id}>
            {showMold && (
              <TableCell>
                <Link
                  className="text-blue-500 hover:underline"
                  href={`/dashboard/molds/${moldHistory.mold_id}`}
                >
                  {moldHistory.mold_name || moldHistory.mold_id}
                </Link>
              </TableCell>
            )}

            {showMachine && (
              <TableCell>
                <Link
                  className="text-blue-500 hover:underline"
                  href={`/dashboard/machines/${moldHistory.machine_id}`}
                >
                  {moldHistory.board} - {moldHistory.port},{" "}
                  {moldHistory.machine_id}
                </Link>
              </TableCell>
            )}

            <TableCell>{moldHistory.start_date}</TableCell>
            <TableCell>{moldHistory.end_date}</TableCell>

            <TableCell>{moldHistory.real_amount}</TableCell>

            {setRange && (
              <TableCell>
                <Button
                  onClick={() => {
                    setRange({
                      from: new Date(moldHistory.start_date),
                      to: new Date(moldHistory.end_date),
                    })

                    setBoardPort &&
                      setBoardPort({
                        board: moldHistory.board,
                        port: moldHistory.port,
                      })
                  }}
                >
                  {t("general.view")}
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
