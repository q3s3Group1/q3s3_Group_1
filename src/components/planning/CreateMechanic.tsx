"use client"

import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Pencil, PlusCircle} from "lucide-react";
import {Mechanic} from "@/types/supabase";
import {FormEvent, useState} from "react";
import {updateMechanic} from "@/lib/supabase/updateMechanic";
import {toast} from "react-toastify";
import {insertMechanic} from "@/lib/supabase/insertMechanic";
import {useLanguage} from "@/lib/i18n/LanguageContext";

interface Props {
    refresh: () => void;
}

export default function CreateMechanic(props: Props){
    const { t } = useLanguage();
    const [updatedMechanic, setUpdatedMechanic] = useState<Partial<Mechanic>>();
    const [opened, setOpened] = useState<boolean>(false)

    function formSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        insertMechanic(updatedMechanic as Required<Omit<Mechanic, "id">>).then(() => {
            toast(t('mechanics.created'), {type: "success"})
            setOpened(false)
            props.refresh()
        }).catch(error => {
            toast(t('mechanics.createError'), {type: "error"});
            console.error(error)
        })
    }

    return (
        <Dialog open={opened} onOpenChange={(v) => setOpened(v)}>
            <DialogTrigger className="flex items-center justify-center gap-1 px-2 rounded-full hover:bg-neutral-200 transition-all py-1">
                <PlusCircle size={17}/> {t('mechanics.add')}
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="font-semibold">{t('mechanics.addMechanic')}</DialogTitle>
                <form className="z-form grid grid-cols-1 gap-3" onSubmit={formSubmit}>
                    <div className="grid grid-cols-2 items-center gap-3">
                        <span>{t('mechanics.name')}</span>
                        <input required type="text" onChange={(e) => setUpdatedMechanic({...updatedMechanic, name:e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-3">
                        <span>{t('mechanics.specialization')}</span>
                        <input required type="text" onChange={(e) => setUpdatedMechanic({...updatedMechanic, specialization:e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-3">
                        <button type={"button"} className="button !bg-neutral-300 !text-neutral-700">{t('common.cancel')}</button>
                        <button type={"submit"} className={"button"}>{t('common.save')}</button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}