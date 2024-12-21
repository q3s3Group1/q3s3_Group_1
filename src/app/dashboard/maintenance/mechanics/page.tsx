
import { fetchMechanics } from "@/lib/supabase/fetchMechanics";

import Header from "../../header";

import { MechanicTable } from "./table";

export default async function Page() {
  const mechanics = await fetchMechanics();

  return (
    <>
      <Header
        title={"Monteurs"}
        description={"Hier kun je monteurs toevoegen, verwijderen en aanpassen."}
      />
      <div>
        <MechanicTable mechanics={mechanics} />
        
      </div>
    </>
  );
}
