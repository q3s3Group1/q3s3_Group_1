"use client";
import { Mechanic } from "@/types/supabase";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import UpdateMechanic from "@/components/planning/UpdateMechanic";
import CreateMechanic from "@/components/planning/CreateMechanic";
import {Calendar1, LayoutDashboard} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchMechanics } from "@/lib/supabase/fetchMechanics";
import { useLanguage } from "@/lib/i18n/LanguageContext";


// props
interface MechanicTableProps {
    mechanics: Mechanic[];
}

export const MechanicTable = (props: MechanicTableProps) => {
const [mechanics, setMechanics] = useState<Mechanic[]>(props.mechanics);
const { t } = useLanguage();

useEffect(() => {
    setMechanics(props.mechanics);
}, [props.mechanics]);

function refreshMechanics(): void {
    fetchMechanics().then(fetched => setMechanics(fetched));
  }

const orderedMechanics = [...mechanics].sort((a, b) => Number(a.id) - Number(b.id));

return (
<Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead>{t('mechanics.name')}</TableHead>
              <TableHead>{t('mechanics.specialization')}</TableHead>
              <TableHead className="text-center">{t('mechanics.dashboardLink')}</TableHead>
              <TableHead className="text-center">{t('mechanics.planning')}</TableHead>
              <TableHead className={"flex items-center justify-center"} rowSpan={2}><CreateMechanic refresh={refreshMechanics}/></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderedMechanics.map((mechanic) => (
              <TableRow key={mechanic.id}>
                <TableCell className="font-medium">{mechanic.name}</TableCell>
                <TableCell className="">{mechanic.specialization}</TableCell>
                <TableCell className="w-16">
                  <a
                      href={`/dashboard/maintenance/mechanic/${mechanic.id}/dashboard`}
                      className="flex items-center justify-center gap-1 rounded-full px-2 py-1 text-sm hover:bg-neutral-200 transition-all"
                  >
                    <LayoutDashboard size={17}/> {t('mechanics.dashboardLink')}
                  </a>
                </TableCell>
                <TableCell className={"w-16"}>
                  <a
                      href={`/dashboard/maintenance/mechanic/${mechanic.id}`}
                      className="flex items-center justify-center gap-1 rounded-full px-2 py-1 text-sm hover:bg-neutral-200 transition-all"
                  >
                    <Calendar1 size={17}/> {t('mechanics.planning')}
                  </a>
                </TableCell>
                <TableCell className={"w-14"}>
                  <UpdateMechanic refresh={refreshMechanics} mechanic={mechanic} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                {t('mechanics.total', {count: mechanics.length})}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
);

}