"use client";

import { useEffect, useState } from "react";
import { fetchMachines } from "@/lib/supabase/fetchMachines";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusIndicator from "@/components/timeline/StatusIndicator";
import Link from "next/link";
import Header from "../header";
import type { Machine } from "@/types/supabase";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMachines()
      .then((data) => setMachines(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Header title={t("machines.all")} description={t("machines.all")} />
        <div className="text-center text-gray-400">Loading machines...</div>
      </div>
    );
  }

  return (
    <>
      <Header title={t("machines.all")} description={t("machines.all")} />
      <div className="p-6">
        <Table>
          <TableCaption>{t("machines.all")}</TableCaption>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead>{t("status.unknown")}</TableHead>
              <TableHead className="w-[160px]">{t("machines.machine")}</TableHead>
              <TableHead>{t("general.end")}</TableHead>
              <TableHead className="text-right w-36">{t("planning.timeSinceLastShot") || "Time Since Last Shot"}</TableHead>
              <TableHead className="text-right w-28">{t("general.total") || "Total Shots"}</TableHead>
              <TableHead className="text-right w-40">{t("general.view") || "Avg. Shot Time (s)"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machines.map((m) => (
              <TableRow key={m.machine_id}>
                <TableCell className="flex items-center justify-start gap-2">
                  <StatusIndicator status={m.status} />
                  {t(`status.${m.status?.toLowerCase()}`) ?? m.status ?? t("status.unknown")}
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/dashboard/machines/${m.machine_id}`}
                    className="text-blue-500 underline"
                  >
                    {m.machine_name || `Machine ${m.machine_id}`}
                  </Link>
                </TableCell>
                <TableCell>
                  {m.last_ts ? new Date(m.last_ts).toLocaleString() : t("common.na")}
                </TableCell>
                <TableCell className="text-right">
                  {m.time_since_last_shot ?? t("common.na")}
                </TableCell>
                <TableCell className="text-right">
                  {m.total_shots?.toLocaleString?.() ?? 0}
                </TableCell>
                <TableCell className="text-right">
                  {typeof (m as any).avg_shot_time === "number"
                    ? (m as any).avg_shot_time.toFixed(2)
                    : "0.00"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                {t("common.total")}: {machines.length} {t("machines.all")}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
