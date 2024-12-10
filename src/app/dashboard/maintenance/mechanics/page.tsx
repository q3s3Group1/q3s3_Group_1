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
                      href={`/dashboard/maintenance/mechanics/${mechanic.id}/calendar`}
                      className="flex items-center justify-center gap-1 px-2 rounded-full hover:bg-neutral-200 transition-all py-1"
                  >
                    <Calendar1 size={17}/> planning
                  </a>
                </TableCell>
                <TableCell className={"w-14"}>
                  <Dialog>
                    <DialogTrigger className="flex items-center justify-center gap-1 px-2 rounded-full hover:bg-neutral-200 transition-all py-1">
                      <Pencil size={17}/> bewerken
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="font-semibold">Monteurinformatie</DialogTitle>
                      <form className="z-form grid grid-cols-1 gap-3">
                        <div className="grid grid-cols-2 items-center gap-3">
                          <span>Naam</span>
                          <input required type="text" value={mechanic.name}/>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-3">
                          <span>Specialisatie</span>
                          <input required type="text" value={mechanic.specialization}/>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-3">
                          <button type={"button"} className="button !bg-neutral-300 !text-neutral-700">Annuleren</button>
                          <button className={"button"}>Opslaan</button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
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
