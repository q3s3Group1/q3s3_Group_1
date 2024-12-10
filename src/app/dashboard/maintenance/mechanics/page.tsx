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
import Link from "next/link";
import Header from "../../header";
import {Calendar1, Pencil} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import UpdateMechanic from "@/components/planning/UpdateMechanic";

export default async function Page() {
  const mechanics = await fetchMechanics();

  return (
    <>
      <Header />
      <div>
        <Table>
          <TableCaption>Mechanics</TableCaption>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mechanics.map((mechanic) => (
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
                  <UpdateMechanic mechanic={mechanic} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>
                Total: {mechanics.length} mechanics
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
