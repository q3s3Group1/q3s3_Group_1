"use client";

import {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {MaintenanceFull, MaintenanceMachine, Mechanic} from "@/types/supabase";
import {fetchMechanic} from "@/lib/supabase/fetchMechanic";
import {fetchAllMaintenance} from "@/lib/supabase/fetchAllMaintenance";
import {updateMaintenanceStatus} from "@/lib/supabase/updateMaintenanceStatus";
import {useLanguage} from "@/lib/i18n/LanguageContext";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {toast} from "react-toastify";
import {Loader2, RefreshCcw, PlayCircle, CheckCircle2, CalendarDays} from "lucide-react";
import {cn} from "@/lib/utils";

interface MechanicDashboardProps {
    mechanicId: number;
}

const isKnownStatus = (status: string): status is MaintenanceMachine["status"] =>
    status === "Planned" || status === "Busy" || status === "Finished";

const toLocale = (language: string) => language === "nl" ? "nl-NL" : "en-US";

export default function MechanicDashboard({mechanicId}: Readonly<MechanicDashboardProps>) {
    const {t, language} = useLanguage();
    const [mechanic, setMechanic] = useState<Mechanic | null>(null);
    const [maintenance, setMaintenance] = useState<MaintenanceFull[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const loadData = useCallback(async (options?: { silent?: boolean }) => {
        if (options?.silent) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        try {
            const [mechanicResponse, maintenanceResponse] = await Promise.all([
                fetchMechanic(mechanicId),
                fetchAllMaintenance(null, null, mechanicId)
            ]);

            setMechanic(mechanicResponse);
            // debug: log the fetched maintenance rows client-side
            // eslint-disable-next-line no-console
            console.debug('[MechanicDashboard] fetched maintenance count:', maintenanceResponse?.length, 'sample:', maintenanceResponse?.slice(0,3));

            const sorted = [...maintenanceResponse].sort((a, b) => a.planned_date.getTime() - b.planned_date.getTime());
            setMaintenance(sorted);
        } catch (error) {
            console.error(error);
            toast(t('maintenance.loadError'), {type: 'error'});
        } finally {
            if (options?.silent) {
                setIsRefreshing(false);
            } else {
                setIsLoading(false);
            }
        }
    }, [mechanicId, t]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // avoid hydration mismatch by only rendering the full UI after client mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const {upcoming, past} = useMemo(() => {
        const now = new Date();
        const upcomingPlans = maintenance
            .filter(plan => plan.planned_date.getTime() >= now.getTime())
            .sort((a, b) => a.planned_date.getTime() - b.planned_date.getTime());
        const pastPlans = maintenance
            .filter(plan => plan.planned_date.getTime() < now.getTime())
            .sort((a, b) => b.planned_date.getTime() - a.planned_date.getTime());

        return {upcoming: upcomingPlans, past: pastPlans};
    }, [maintenance]);

    useEffect(() => {
        if (maintenance.length === 0) {
            setSelectedId(null);
            return;
        }

        setSelectedId((current) => {
            if (current && maintenance.some(plan => plan.id === current)) {
                return current;
            }
            return upcoming[0]?.id ?? past[0]?.id ?? null;
        });
    }, [maintenance, upcoming, past]);

    const selectedMaintenance = selectedId ? maintenance.find(plan => plan.id === selectedId) ?? null : null;

    const handleStatusChange = async (status: MaintenanceMachine["status"]) => {
        if (!selectedMaintenance) {
            return;
        }

        setIsUpdatingStatus(true);
        try {
            await updateMaintenanceStatus(selectedMaintenance.id, status);
            toast(t('maintenance.statusUpdated'), {type: 'success'});
            await loadData({silent: true});
        } catch (error) {
            console.error(error);
            toast(t('maintenance.statusUpdateError'), {type: 'error'});
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const renderLoadingState = () => (
        <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white text-sm text-neutral-500">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t('common.loading')}
        </div>
    );

    if (!isMounted) {
        return renderLoadingState();
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>{mechanic?.name ?? t('mechanics.dashboardTitle')}</CardTitle>
                    <CardDescription>
                        {t('mechanics.dashboardDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-6 pt-0 text-sm text-neutral-600">
                    <InfoPill
                        label={t('mechanics.specialization')}
                        value={mechanic?.specialization ?? '—'}
                    />
                    <InfoPill
                        label={t('mechanics.dashboardTotalsLabel')}
                        value={t('mechanics.dashboardTotals', {upcoming: upcoming.length, past: past.length})}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadData({silent: true})}
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                        {t('common.refresh')}
                    </Button>
                </CardContent>
            </Card>

            {isLoading && maintenance.length === 0 ? (
                renderLoadingState()
            ) : (
                <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                    <Card className="flex h-full flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                                {t('mechanics.dashboardListTitle')}
                            </CardTitle>
                            <CardDescription className="text-sm">
                                {t('mechanics.dashboardListSubtitle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex h-full flex-col pt-0">
                            <Tabs defaultValue="upcoming" className="flex h-full flex-col">
                                <TabsList className="mx-auto w-full max-w-xs">
                                    <TabsTrigger value="upcoming">
                                        {t('maintenance.upcomingShort')} ({upcoming.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="past">
                                        {t('maintenance.pastShort')} ({past.length})
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="upcoming" className="flex-1 focus-visible:ring-0">
                                    <MaintenanceList
                                        plans={upcoming}
                                        emptyLabel={t('maintenance.noUpcoming')}
                                        selectedId={selectedId}
                                        onSelect={setSelectedId}
                                        language={language}
                                        t={t}
                                    />
                                </TabsContent>
                                <TabsContent value="past" className="flex-1 focus-visible:ring-0">
                                    <MaintenanceList
                                        plans={past}
                                        emptyLabel={t('maintenance.noPast')}
                                        selectedId={selectedId}
                                        onSelect={setSelectedId}
                                        language={language}
                                        t={t}
                                    />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <Card className="flex h-full flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle>{t('maintenance.detailsTitle')}</CardTitle>
                            <CardDescription>
                                {selectedMaintenance ? `${t('maintenance.assignedMechanic')}: ${mechanic?.name ?? '—'}` : t('maintenance.noSelection')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col gap-5 pt-0 text-sm">
                            {selectedMaintenance ? (
                                <>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-neutral-500">{t('maintenance.status')}</span>
                                        <MaintenanceStatusBadge
                                            status={selectedMaintenance.status}
                                            t={t}
                                        />
                                        <Badge variant="secondary" className="ml-auto">
                                            {selectedMaintenance.maintenance_type === 'Preventative'
                                                ? t('maintenance.preventive')
                                                : t('maintenance.corrective')}
                                        </Badge>
                                    </div>

                                    <dl className="grid gap-3">
                                        <DetailRow label={t('maintenance.machine')}
                                                   value={selectedMaintenance.machine_name || selectedMaintenance.machine_id} />
                                        <DetailRow label={t('maintenance.plannedFor')}
                                                   value={new Intl.DateTimeFormat(toLocale(language), {
                                                       dateStyle: 'full',
                                                       timeStyle: 'short'
                                                   }).format(selectedMaintenance.planned_date)} />
                                        <DetailRow label={t('maintenance.action')}
                                                   value={selectedMaintenance.maintenance_action} />
                                        {selectedMaintenance.description && (
                                            <DetailRow label={t('planning.description')}
                                                       value={selectedMaintenance.description} />
                                        )}
                                    </dl>

                                    <div className="mt-auto flex flex-wrap gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleStatusChange("Busy")}
                                            disabled={isUpdatingStatus || selectedMaintenance.status === 'Busy' || selectedMaintenance.status === 'Finished'}
                                        >
                                            <PlayCircle className="h-4 w-4" />
                                            {t('maintenance.start')}
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusChange("Finished")}
                                            disabled={isUpdatingStatus || selectedMaintenance.status === 'Finished'}
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            {t('maintenance.finish')}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-neutral-500">
                                    <CalendarDays className="h-8 w-8 text-neutral-300" />
                                    <span>{t('maintenance.noSelection')}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

type MaintenanceListProps = Readonly<{
    plans: MaintenanceFull[];
    emptyLabel: string;
    selectedId: number | null;
    onSelect: (maintenanceId: number | null) => void;
    language: string;
    t: (key: string, params?: Record<string, string | number>) => string;
}>;

function MaintenanceList({plans, emptyLabel, selectedId, onSelect, language, t}: MaintenanceListProps) {
    if (plans.length === 0) {
        return (
            <div className="flex h-[420px] items-center justify-center rounded-lg border border-dashed border-neutral-200 text-center text-sm text-neutral-500">
                {emptyLabel}
            </div>
        );
    }

    return (
        <ScrollArea className="h-[420px] pr-2">
            <div className="flex flex-col gap-3 pb-2">
                {plans.map(plan => (
                    <button
                        key={plan.id}
                        onClick={() => onSelect(plan.id)}
                        className={cn(
                            "w-full rounded-xl border p-4 text-left transition-all",
                            selectedId === plan.id
                                ? "border-blue-500 bg-blue-50 shadow"
                                : "border-neutral-200 bg-white hover:border-neutral-300"
                        )}
                    >
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <span className="truncate">{plan.machine_name || plan.machine_id}</span>
                            <MaintenanceStatusBadge status={plan.status} t={t} />
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">
                            {new Intl.DateTimeFormat(toLocale(language), {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                            }).format(plan.planned_date)}
                        </p>
                        <p className="mt-2 text-sm text-neutral-700">
                            {plan.maintenance_action}
                        </p>
                    </button>
                ))}
            </div>
        </ScrollArea>
    );
}

function MaintenanceStatusBadge({status, t}: Readonly<{status: string; t: (key: string, params?: Record<string, string | number>) => string}>) {
    const normalizedStatus: MaintenanceMachine["status"] = isKnownStatus(status) ? status : "Planned";

    let variant: "default" | "secondary" | "outline" = "outline";
    let translationKey = 'maintenance.status.planned';

    if (normalizedStatus === "Finished") {
        variant = "default";
        translationKey = 'maintenance.status.finished';
    } else if (normalizedStatus === "Busy") {
        variant = "secondary";
        translationKey = 'maintenance.status.busy';
    }

    return (
        <Badge variant={variant}>
            {t(translationKey)}
        </Badge>
    );
}

function DetailRow({label, value}: Readonly<{label: string; value: ReactNode}>) {
    return (
        <div className="grid gap-1 rounded-lg border border-neutral-100 p-3">
            <span className="text-xs uppercase tracking-wide text-neutral-500">{label}</span>
            <span className="text-sm font-medium text-neutral-900">
                {value}
            </span>
        </div>
    );
}

function InfoPill({label, value}: Readonly<{label: string; value: string}>) {
    return (
        <div className="rounded-xl border border-neutral-200 px-4 py-2">
            <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
            <p className="text-sm font-semibold text-neutral-900">{value}</p>
        </div>
    );
}
