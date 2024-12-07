import {MaintenanceFull, Mechanic} from "@/types/supabase";
import {ChangeEvent, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import { fetchMechanics } from "@/lib/supabase/fetchMechanics";
import { formatDateToISO } from "@/lib/utils";

interface Props {
    maintenance: MaintenanceFull
}

export default function FullMaintenanceDetails(props: Props) {
    const [editing, setEditing] = useState(false);
    const [editedForm, setEditedForm] = useState<MaintenanceFull>(props.maintenance)
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);

    function updateFormValue(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>) {
        setEditedForm({
            ...editedForm,
            [e.target.name]: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value)
        })
    }

    useEffect(() => {
        fetchMechanics().then(mechanics => setMechanics(mechanics));
    }, []);

    if (editing) {
        return (
            <div className="block w-full h-full">
                <div className="grid grid-cols-2 gap-4">
                    <span className="block font-semibold">Matrijs</span>
                    <span>{props.maintenance.mold_description}</span>

                    <span className="block font-semibold">Gepland voor</span>
                    <Input onChange={updateFormValue} name="planned_date" type='datetime-local'
                           value={(formatDateToISO(new Date(props.maintenance.planned_date)))}/>

                    <span className="block font-semibold">Onderhoudstype</span>
                    <select onChange={updateFormValue} name="maintenance_type">
                        <option value="Preventative">Preventief</option>
                        <option value="Corrective">Correctief</option>
                    </select>

                    <span className="block font-semibold">Onderhoudsactie</span>
                    <select onChange={updateFormValue}
                            name="maintenance_action">
                        <option value="" disabled selected>Selecteer een optie</option>
                        <option value={"Poetsen"}>Poetsen</option>
                        <option value={"Kalibreren"}>Kalibreren</option>
                    </select>

                    <span className="block font-semibold">Beschrijving</span>
                    <textarea onChange={updateFormValue} name="description" value={editedForm.description}/>

                    <span className="block font-semibold">Toegewezen monteur</span>
                    <select onChange={updateFormValue} name="assigned_to">
                        <option value="" disabled selected>Selecteer een optie</option>
                        {mechanics.map(m => (<option key={m.id} value={m.id}>{m.name} ({m.specialization})</option>))}
                    </select>

                    <button onClick={() => setEditing(false)}
                            className="button !bg-neutral-300 !text-neutral-800">Annuleren
                    </button>
                    <button className="button !bg-green-500">Opslaan</button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="block w-full h-full">
                <div className="grid grid-cols-2 gap-4">
                    <span className="block font-semibold">Matrijs</span>
                    <span>{props.maintenance.mold_description}</span>

                    <span className="block font-semibold">Gepland voor</span>
                    <span>{props.maintenance.planned_date}</span>

                    <span className="block font-semibold">Onderhoudstype</span>
                    <span>{props.maintenance.maintenance_type}</span>

                    <span className="block font-semibold">Onderhoudsactie</span>
                    <span>{props.maintenance.maintenance_action}</span>

                    <span className="block font-semibold">Beschrijving</span>
                    <span>{props.maintenance.description}</span>

                    <span className="block font-semibold">Toegewezen monteur</span>
                    <span>{props.maintenance.mechanic_name} ({props.maintenance.mechanic_specialization})</span>

                    <span></span>
                    <button onClick={() => setEditing(true)} className="button">Bewerken</button>
                </div>
            </div>
        )
    }

}