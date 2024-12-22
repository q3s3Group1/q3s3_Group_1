import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { MoldMaintenance } from "@/types/supabase";

  interface MilestoneSheetProps {
    molds: MoldMaintenance[];
}

  export default function MilestoneSheet({ molds }: MilestoneSheetProps) {
    return (
        <Sheet>
  <SheetTrigger>Nieuwe onderhoudsbeurt toevoegen</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Kies matrijs</SheetTitle>
      <SheetDescription>
        <select>
          {molds.map((mold) => (
            <option key={mold.mold_id} value={mold.mold_id}>
              {mold.mold_name} ({mold.total_shots} shots)
            </option>
          ))}
        </select>
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>

    )
};