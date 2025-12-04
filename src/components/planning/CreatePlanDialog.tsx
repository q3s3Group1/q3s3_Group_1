"use client";

import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Plus} from "lucide-react";
import {Input} from "@/components/ui/input";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {Machine, MaintenanceMachine, Mechanic} from "@/types/supabase";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";
import {insertNewMaintenance} from "@/lib/supabase/insertNewMaintenance";
import {fetchMechanics} from "@/lib/supabase/fetchMechanics";
import {formatDateToISO} from "@/lib/utils";
import {insertNewMachineMaintenanceMilestone} from "@/lib/supabase/insertNewMachineMaintenanceMilestone";
import {useLanguage} from "@/lib/i18n/LanguageContext";
import { fetchMachines } from "@/lib/supabase/fetchMachines";
import { machine } from "os";

interface Props {
    formData: Partial<Omit<MaintenanceMachine, "id" | "status">>
    onCreatedNewPlanning: () => void
}

export default function CreatePlanDialog(props: Props) {
    const { t } = useLanguage();
    const [maintenanceForm, setMaintenanceForm] = useState<Partial<Omit<MaintenanceMachine, "id" | "status"> & {lifespan: number}>>(props.formData);

    const [machines, setMachines] = useState<Machine[]>([]);
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [isManual, setIsManual] = useState<boolean>(true);

    function handleOpenedChange(open: boolean) {
        setIsOpened(open);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        if (isManual){
            insertNewMaintenance(maintenanceForm as Required<Omit<MaintenanceMachine, "id" | "status">>).then(() => {
                toast(t('planning.maintenanceScheduled'), {type: "success"});
                setIsOpened(false)
                props.onCreatedNewPlanning()

            }).catch((reason: Error) => {
                toast(t('planning.maintenanceScheduleError'), {type: "error"});
                console.log(reason)
            })
        }
        else {
            insertNewMachineMaintenanceMilestone(maintenanceForm.machine_id!, maintenanceForm.lifespan!).then(() => {
                toast(t('planning.milestoneSet'), {type: "success"});
                setIsOpened(false)
            }).catch((reason: Error) => {
                toast(t('planning.milestoneSetError'), {type: "error"});
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
        fetchMachines().then((fetchedMachines) => setMachines(fetchedMachines));
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
            <DialogTrigger className="button"><Plus size={20}/> {t('planning.scheduleMaintenance')}</DialogTrigger>
            <DialogContent className={"rounded-xl"}>
                <DialogTitle>{t('planning.scheduleMaintenance')}</DialogTitle>
                <form className="" onSubmit={handleSubmit}>
                    <div className={"flex flex-col z-form items-center gap-3 w-full"}>
                        <div className={"grid grid-cols-2 gap-2 w-full h-max"}>
                            <button type={"button"} onClick={() => setIsManual(true)}
                                    className={isManual ? "method-btn method-btn-select" : 'method-btn'}>
                                {t('planning.manual')}
                            </button>
                            <button type={"button"} onClick={() => setIsManual(false)}
                                    className={!isManual ? "method-btn method-btn-select" : 'method-btn'}>
                                {t('planning.predictive')}
                            </button>
                        </div>


                        <div className={`grid grid-cols-2 items-center gap-3 w-full ${isManual ? '' : 'hidden'}`}>
                            <span className={"text-sm font-semibold"}>{t('planning.date')}</span>
                            <Input disabled={!isManual} required type={"datetime-local"}
                                   min={formatDateToISO(new Date(Date.now()))}
                                   name="planned_date" onChange={updateFormValue}/>
                        </div>

                        <div className={"grid grid-cols-2 items-center gap-3 w-full"}>
                            <span className={"text-sm font-semibold"}>{t('planning.machine')}</span>
                            <select required defaultValue={""} name="machine_id" onChange={updateFormValue}>
                                <option value="" disabled>{t('planning.selectOption')}</option>
                                {machines.map((m, index) => <option value={m.machine_id}
                                                                 key={index}>{m.machine_name
                                    || m.machine_id
                                }

                                {/* Shots */}
                                {` (${m.total_shots} shots)`}
                                </option>)}
                            </select>
                        </div>

                        <div className={`grid grid-cols-2 items-center gap-3 w-full ${!isManual ? '' : 'hidden'}`}>
                            <span className={"text-sm font-semibold"}>{t('planning.lifespan')}</span>
                            <Input disabled={isManual} required type={"number"}
                                   min={0}
                                   name="lifespan" onChange={updateFormValue}/>
                        </div>

                        <div className={`grid grid-cols-2 items-center gap-3 w-full ${isManual ? '' : 'hidden'}`}>
                            <span className={"text-sm font-semibold"}>{t('planning.maintenanceType')}</span>
                            <select disabled={!isManual} defaultValue={""} required name="maintenance_type"
                                    onChange={updateFormValue}>
                                <option value="" disabled>{t('planning.selectOption')}</option>
                                <option value={"Preventative"}>{t('planning.preventive')}</option>
                                <option value={"Corrective"}>{t('planning.corrective')}</option>
                            </select>
                        </div>

                        <div className={`grid grid-cols-2 items-center gap-3 w-full ${isManual ? '' : 'hidden'}`}>
                            <span className={"text-sm font-semibold"}>{t('planning.maintenanceAction')}</span>
                            <select disabled={!isManual} defaultValue={""} required name="maintenance_action"
                                    onChange={updateFormValue}>
                                <option value="" disabled>{t('planning.selectOption')}</option>
                                <option>{t('planning.actions.calibrate')}</option>
                                <option>{t('planning.actions.clean')}</option>
                                <option>{t('planning.actions.inspect')}</option>
                                <option>{t('planning.actions.lubricate')}</option>
                                <option>{t('planning.actions.checkCooling')}</option>
                                <option>{t('planning.actions.cleanNozzle')}</option>
                                <option>{t('planning.actions.tightenFasteners')}</option>
                                <option>{t('planning.actions.checkHotRunner')}</option>
                                <option>{t('planning.actions.polish')}</option>
                                <option>{t('planning.actions.replaceSeals')}</option>
                                <option>{t('planning.actions.testClampForce')}</option>
                                <option>{t('planning.actions.reviseGuides')}</option>
                                <option>{t('planning.actions.inspectElectrical')}</option>
                                <option>{t('planning.actions.degas')}</option>
                                <option>{t('planning.actions.checkAlignment')}</option>
                                <option>{t('planning.actions.replaceWearStrips')}</option>
                                <option>{t('planning.actions.checkTemperature')}</option>
                            </select>
                        </div>

                        <div className={`grid grid-cols-2 items-center gap-3 ${isManual ? '' : 'hidden'}`}>
                            <span className={"text-sm font-semibold"}>{t('planning.description')}</span>
                            <input disabled={!isManual} type='text' required name="description"
                                   onChange={updateFormValue}/>

                        </div>

                        <div className={`grid grid-cols-2 items-center gap-3 ${isManual ? '' : 'hidden'}`}>
                            <span className={"text-sm font-semibold"}>{t('planning.mechanic')}</span>
                            <select disabled={!isManual} defaultValue={""} required name="assigned_to" onChange={updateFormValue}>
                                <option value="" disabled>{t('planning.selectOption')}</option>
                                {mechanics.map((mechanic) => (
                                    <option value={mechanic.id}
                                            key={mechanic.id}>{mechanic.name} ({mechanic.specialization})</option>
                                ))}
                            </select>
                        </div>


                    </div>

                    <div className={"w-full flex mt-4"}>
                        <button type={"submit"} className="ml-auto button"><Plus size={20}/> {t('planning.schedule')}</button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>


    )
}