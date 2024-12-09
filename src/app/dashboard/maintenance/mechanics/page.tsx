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
              <TableHead>Calendar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mechanics.map((mechanic) => (
              <TableRow key={mechanic.id}>
                <TableCell className="font-medium">{mechanic.name}</TableCell>
                <TableCell>{mechanic.specialization}</TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/maintenance/mechanics/${mechanic.id}/calendar`}
                    className="text-blue-500 underline"
                  >
                    View Calendar
                  </Link>
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
