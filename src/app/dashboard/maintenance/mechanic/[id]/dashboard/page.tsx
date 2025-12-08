"use client";

import Header from "@/app/dashboard/header";
import MechanicDashboard from "@/components/maintenance/MechanicDashboard";
import {useLanguage} from "@/lib/i18n/LanguageContext";
import {useParams} from "next/navigation";

export default function Page() {
    const params = useParams<{ id: string }>();
    const {t} = useLanguage();
    const mechanicId = Number(params.id);

    return (
        <div className="flex flex-col gap-6">
            <Header
                title={t('mechanics.dashboardTitle')}
                description={t('mechanics.dashboardDescription')}
            />
            <MechanicDashboard mechanicId={mechanicId} />
        </div>
    );
}
