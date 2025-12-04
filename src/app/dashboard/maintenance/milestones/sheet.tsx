import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { MachineMaintenance } from "@/types/supabase";

  interface MilestoneSheetProps {
    molds: MachineMaintenance[];
}

  export default function MilestoneSheet({ molds }: MilestoneSheetProps) {
    return (
        <Sheet>
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