"use client"

import { fetchMechanics } from "@/lib/supabase/fetchMechanics";
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
import Header from "../../header";
import {Calendar1, Pencil} from "lucide-react";
import UpdateMechanic from "@/components/planning/UpdateMechanic";
import CreateMechanic from "@/components/planning/CreateMechanic";
import {useEffect, useState} from "react";
import {Mechanic} from "@/types/supabase";

export default function Page() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);

  function refreshMechanics(): void {
    fetchMechanics().then(fetched => setMechanics(fetched));

  }

  useEffect(refreshMechanics);

  return (
    <>
      <Header
        title={"Monteurs"}
        description={"Hier kun je monteurs toevoegen, verwijderen en aanpassen."}
      />
      <div>
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead>Naam</TableHead>
              <TableHead>Specialisatie</TableHead>
              <TableHead/>
              <TableHead className={"flex items-center justify-center"} rowSpan={2}><CreateMechanic refresh={refreshMechanics}/></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mechanics.sort(m => Number(m.id)).map((mechanic) => (
              <TableRow key={mechanic.id}>
                <TableCell className="font-medium">{mechanic.name}</TableCell>
                <TableCell className="">{mechanic.specialization}</TableCell>
                <TableCell className={"w-14"}>
                  <a
                      href={`/dashboard/maintenance/mechanic/${mechanic.id}`}
                      className="flex items-center justify-center gap-1 px-2 rounded-full hover:bg-neutral-200 transition-all py-1"
                  >
                    <Calendar1 size={17}/> planning
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
              <TableCell colSpan={4}>
                Totaal: {mechanics.length} monteurs
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
