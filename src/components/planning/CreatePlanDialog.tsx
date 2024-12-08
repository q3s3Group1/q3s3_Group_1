"use client";

import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Plus} from "lucide-react";
import {Input} from "@/components/ui/input";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {Maintenance, Mechanic, Mold} from "@/types/supabase";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";
import {insertNewMaintenance} from "@/lib/supabase/insertNewMaintenance";
import {fetchAllMolds} from "@/lib/supabase/fetchMolds";
import {fetchMechanics} from "@/lib/supabase/fetchMechanics";
import {formatDateToISO} from "@/lib/utils";

interface Props {
    formData: Partial<Omit<Maintenance, "id" | "status">>
    onCreatedNewPlanning: () => void
}

export default function CreatePlanDialog(props: Props) {
    const [maintenanceForm, setMaintenanceForm] = useState<Partial<Omit<Maintenance, "id" | "status">>>(props.formData);

    const [molds, setMolds] = useState<Mold[]>([]);
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [isOpened, setIsOpened] = useState<boolean>(false);

    function handleOpenedChange(open: boolean) {
        setIsOpened(open);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        insertNewMaintenance(maintenanceForm as Required<Omit<Maintenance, "id" | "status">>).then(() => {
            toast("Onderhoud is ingepland.", {type: "success"});
            setIsOpened(false)
            props.onCreatedNewPlanning()

        }).catch((reason: Error) => {
            toast("Kon onderhoud niet inplannen.", {type: "error"});
            console.log(reason)
        })
    }

    function updateFormValue(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>) {
        setMaintenanceForm({
            ...maintenanceForm,
            [e.target.name]: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value)
        })
    }

    useEffect(() => {
        fetchAllMolds().then((fetchedMolds) => setMolds(fetchedMolds));
        fetchMechanics().then((mechanics) => setMechanics(mechanics));
    }, []);

    return (
        <Dialog open={isOpened} onOpenChange={handleOpenedChange}>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <DialogTrigger className="button"><Plus size={20}/> Onderhoud plannen</DialogTrigger>
            <DialogContent className={"rounded-xl"}>
                <DialogTitle>Onderhoud plannen</DialogTitle>
                <form className="" onSubmit={handleSubmit}>
                    <div className={"grid grid-cols-2 z-form items-center gap-3"}>
                        <span className={"text-sm font-semibold"}>Datum</span>
                        <Input required type={"datetime-local"} min={formatDateToISO(new Date(Date.now()))}
                               name="planned_date" onChange={updateFormValue}/>

                        <span className={"text-sm font-semibold"}>Matrijs</span>
                        <select required name="mold_id" onChange={updateFormValue}>
                            <option value="" disabled>Selecteer een optie</option>
                            {molds.map((m, index) => <option value={m.id}
                                                             key={index}>{m.description}</option>)}
                        </select>

                        <span className={"text-sm font-semibold"}>Onderhoudstype</span>
                        <select required name="maintenance_type" onChange={updateFormValue}>
                            <option value="" disabled>Selecteer een optie</option>
                            <option value={"Preventative"}>Preventief</option>
                            <option value={"Corrective"}>Correctief</option>
                        </select>

                        <span className={"text-sm font-semibold"}>Onderhoudsactie</span>
                        <select required name="maintenance_action" onChange={updateFormValue}>
                            <option value="" disabled>Selecteer een optie</option>
                            <option>Kalibreren</option>
                            <option>Poetsen</option>
                        </select>

                        <span className={"text-sm font-semibold"}>Beschrijving</span>
                        <input type='text' required name="description" onChange={updateFormValue}/>

                        <span className={"text-sm font-semibold"}>Monteur</span>
                        <select required name="assigned_to" onChange={updateFormValue}>
                            <option value="" disabled>Selecteer een optie</option>
                            {mechanics.map((mechanic) => (
                                <option value={mechanic.id}
                                        key={mechanic.id}>{mechanic.name} ({mechanic.specialization})</option>
                            ))}
                        </select>
                    </div>

                    <div className={"w-full flex mt-4"}>
                        <button type={"submit"} className="ml-auto button"><Plus size={20}/> Plannen</button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    )
}