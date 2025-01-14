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
import {insertNewMoldMaintenanceMilestone} from "@/lib/supabase/insertNewMoldMaintenanceMilestone";

interface Props {
    formData: Partial<Omit<Maintenance, "id" | "status">>
    onCreatedNewPlanning: () => void
}

export default function CreatePlanDialog(props: Props) {
    const [maintenanceForm, setMaintenanceForm] = useState<Partial<Omit<Maintenance, "id" | "status"> & {lifespan: number}>>(props.formData);

    const [molds, setMolds] = useState<Mold[]>([]);
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [isManual, setIsManual] = useState<boolean>(true);

    function handleOpenedChange(open: boolean) {
        setIsOpened(open);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        if (isManual){
            insertNewMaintenance(maintenanceForm as Required<Omit<Maintenance, "id" | "status">>).then(() => {
                toast("Onderhoud is ingepland.", {type: "success"});
                setIsOpened(false)
                props.onCreatedNewPlanning()

            }).catch((reason: Error) => {
                toast("Kon onderhoud niet inplannen.", {type: "error"});
                console.log(reason)
            })
        }
        else {
            insertNewMoldMaintenanceMilestone(maintenanceForm.mold_id!, maintenanceForm.lifespan!).then(() => {
                toast("Milestone is ingesteld.", {type: "success"});
                setIsOpened(false)
            }).catch((reason: Error) => {
                toast("Kon milestone niet instellen.", {type: "error"});
                console.log(reason)
            })
        }
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
                    <div className={"flex flex-col z-form items-center gap-3 w-full"}>
                        <div className={"grid grid-cols-2 gap-2 w-full h-max"}>
                            <button type={"button"} onClick={() => setIsManual(true)}
                                    className={isManual ? "method-btn method-btn-select" : 'method-btn'}>Handmatig
                            </button>
                            <button type={"button"} onClick={() => setIsManual(false)}
                                    className={!isManual ? "method-btn method-btn-select" : 'method-btn'}>Voorspellend
                            </button>
                        </div>


                        <div className={`grid grid-cols-2 items-center gap-3 w-full ${isManual ? '' : 'hidden'}`}>
                            <span className={"text-sm font-semibold"}>Datum</span>
                            <Input disabled={!isManual} required type={"datetime-local"}
                                   min={formatDateToISO(new Date(Date.now()))}
                                   name="planned_date" onChange={updateFormValue}/>
                        </div>

                        <div className={"grid grid-cols-2 items-center gap-3 w-full"}>
                            <span className={"text-sm font-semibold"}>Matrijs</span>
                            <select required defaultValue={""} name="mold_id" onChange={updateFormValue}>
                                <option value="" disabled>Selecteer een optie</option>
                                {molds.map((m, index) => <option value={m.mold_id}
                                                                 key={index}>{m.mold_name
                                    || m.mold_id
                                }

                                {/* Shots */}
                                {` (${m.total_shots} shots)`}
                                </option>)}
                            </select>
                        </div>

                        <div className={`grid grid-cols-2 items-center gap-3 w-full ${!isManual ? '' : 'hidden'}`}>
                            <span className={"text-sm font-semibold"}>Levensduur</span>
                            <Input disabled={isManual} required type={"number"}
                                   min={0}
                                   name="lifespan" onChange={updateFormValue}/>
                        </div>

                        <div className={`grid grid-cols-2 items-center gap-3 w-full ${isManual ? '' : 'hidden'}`}>
                            <span className={"text-sm font-semibold"}>Onderhoudstype</span>
                            <select disabled={!isManual} defaultValue={""} required name="maintenance_type"
                                    onChange={updateFormValue}>
                                <option value="" disabled>Selecteer een optie</option>
                                <option value={"Preventative"}>Preventief</option>
                                <option value={"Corrective"}>Correctief</option>
                            </select>
                        </div>

                        <div className={`grid grid-cols-2 items-center gap-3 w-full ${isManual ? '' : 'hidden'}`}>
                            <span className={"text-sm font-semibold"}>Onderhoudsactie</span>
                            <select disabled={!isManual} defaultValue={""} required name="maintenance_action"
                                    onChange={updateFormValue}>
                                <option value="" disabled>Selecteer een optie</option>
                                <option>Kalibreren</option>
                                <option>Poetsen</option>
                                <option>Inspecteren</option>
                                <option>Smeren</option>
                                <option>Koelingskanalen controleren</option>
                                <option>Spuitneus reinigen</option>
                                <option>Bevestigingen aanspannen</option>
                                <option>Hot-runner controleren</option>
                                <option>Polijsten</option>
                                <option>Afdichtingen vervangen</option>
                                <option>Sluitkracht testen</option>
                                <option>Geleiders reviseren</option>
                                <option>Elektrische aansluitingen inspecteren</option>
                                <option>Ontgassen</option>
                                <option>Uitlijning controleren</option>
                                <option>Slijtstrippen vervangen</option>
                                <option>Temperatuurzones controleren</option>
                            </select>
                        </div>

                        <div className={`grid grid-cols-2 items-center gap-3 ${isManual ? '' : 'hidden'}`}>
                            <span className={"text-sm font-semibold"}>Beschrijving</span>
                            <input disabled={!isManual} type='text' required name="description"
                                   onChange={updateFormValue}/>

                        </div>

                        <div className={`grid grid-cols-2 items-center gap-3 ${isManual ? '' : 'hidden'}`}>
                            <span className={"text-sm font-semibold"}>Monteur</span>
                            <select disabled={!isManual} defaultValue={""} required name="assigned_to" onChange={updateFormValue}>
                                <option value="" disabled>Selecteer een optie</option>
                                {mechanics.map((mechanic) => (
                                    <option value={mechanic.id}
                                            key={mechanic.id}>{mechanic.name} ({mechanic.specialization})</option>
                                ))}
                            </select>
                        </div>


                    </div>

                    <div className={"w-full flex mt-4"}>
                        <button type={"submit"} className="ml-auto button"><Plus size={20}/> Plannen</button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>


    )
}