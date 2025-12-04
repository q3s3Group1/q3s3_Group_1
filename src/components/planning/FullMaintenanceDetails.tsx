"use client"

import {MaintenanceFull, Mechanic} from "@/types/supabase";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {fetchMechanics} from "@/lib/supabase/fetchMechanics";
import {formatDateToISO} from "@/lib/utils";
import {updateMaintenance} from "@/lib/supabase/updateMaintenance";
import {toast} from "react-toastify";
import {useLanguage} from "@/lib/i18n/LanguageContext";

interface Props {
    maintenance: MaintenanceFull,
    onEdited: () => void
}

export default function FullMaintenanceDetails(props: Props) {
    const { t, language } = useLanguage();
    const [editing, setEditing] = useState(false);
    const [editedForm, setEditedForm] = useState<MaintenanceFull>(props.maintenance)
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);

    function updateFormValue(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>) {
        setEditedForm({
            ...editedForm,
            [e.target.name]: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value)
        })
    }

    function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        // klote fix omdat te veel velden werden meegestuurd in supabase update
        updateMaintenance({
            id: editedForm.id,
            assigned_to: editedForm.assigned_to,
            description: editedForm.description,
            maintenance_type: editedForm.maintenance_type,
            maintenance_action: editedForm.maintenance_action,
            planned_date: new Date(editedForm.planned_date),
            machine_id: editedForm.machine_id
        }).then(() => {
            toast(t('maintenance.updated'), {type: 'success'})
            props.onEdited()
            setEditing(false)
        }).catch((e) => {
            toast(t('maintenance.updateError'), {type: 'error'})
            console.error(e)
        })
    }

    useEffect(() => {
        fetchMechanics().then(mechanics => setMechanics(mechanics));
    }, []);

    if (editing) {
        return (
            <form onSubmit={handleFormSubmit} className="block w-full h-full z-form">
                <div className="grid grid-cols-2 gap-4">
                    <span className="block font-semibold">{t('maintenance.machine')}</span>
                    <span>{props.maintenance.machine_name || props.maintenance.machine_id}</span>

                    <span className="block font-semibold">{t('maintenance.plannedFor')}</span>
                    <Input onChange={updateFormValue} name="planned_date" type='datetime-local'
                           value={(formatDateToISO(new Date(editedForm.planned_date)))}/>

                    <span className="block font-semibold">{t('maintenance.type')}</span>
                    <select onChange={updateFormValue} value={editedForm.maintenance_type}
                            name="maintenance_type">
                        <option value="Preventative">{t('maintenance.preventive')}</option>
                        <option value="Corrective">{t('maintenance.corrective')}</option>
                    </select>

                    <span className="block font-semibold">{t('maintenance.action')}</span>
                    <select onChange={updateFormValue} value={editedForm.maintenance_action}
                            name="maintenance_action">
                        <option value="" disabled>{t('maintenance.selectOption')}</option>
                        <option value={"Poetsen"}>{t('maintenance.actions.clean')}</option>
                        <option value={"Kalibreren"}>{t('maintenance.actions.calibrate')}</option>
                    </select>

                    <span className="block font-semibold">{t('maintenance.assignedMechanic')}</span>
                    <select onChange={updateFormValue} value={editedForm.assigned_to} name="assigned_to">
                        <option value="" disabled>{t('maintenance.selectOption')}</option>
                        {mechanics.map(m => (<option key={m.id} value={m.id}>{m.name} ({m.specialization})</option>))}
                    </select>

                    <button onClick={() => setEditing(false)}
                            className="button !bg-neutral-300 !text-neutral-800">{t('common.cancel')}
                    </button>
                    <button type={"submit"} className="button !bg-green-500">{t('common.save')}</button>
                </div>
            </form>
        )
    } else {
        return (
            <div className="block w-full h-full">
                <div className="grid grid-cols-2 gap-4">
                    <span className="block font-semibold">{t('maintenance.machine')}</span>
                    <span>{props.maintenance.machine_name || props.maintenance.machine_id}</span>

                    <span className="block font-semibold">{t('maintenance.plannedFor')}</span>
                    <span>{new Intl.DateTimeFormat(language === 'nl' ? "nl" : "en", {
                        dateStyle: "medium",
                        timeStyle: "medium"
                    }).format(props.maintenance.planned_date)}</span>

                    <span className="block font-semibold">{t('maintenance.type')}</span>
                    <span>{props.maintenance.maintenance_type === 'Preventative' ? t('maintenance.preventive') : t('maintenance.corrective')}</span>

                    <span className="block font-semibold">{t('maintenance.action')}</span>
                    <span>{props.maintenance.maintenance_action}</span>

                    <span className="block font-semibold">{t('maintenance.assignedMechanic')}</span>
                    <span>{props.maintenance.mechanic_name} ({props.maintenance.mechanic_specialization})</span>

                    <span></span>
                    <button onClick={() => setEditing(true)} className="button">{t('common.edit')}</button>
                </div>
            </div>
        )
    }
}