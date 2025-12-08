// lib/i18n/LanguageContext.tsx
"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

type Language = 'nl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  nl: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.molds': 'Matrijzen',
    'nav.machines': 'Machines',
    'nav.maintenance': 'Onderhoud',
    'nav.mechanics': 'Monteurs',
    
    // Common
    'common.total': 'Totaal',
    'common.yes': 'Ja',
    'common.no': 'Nee',
    'common.na': 'N/A',
    'common.view': 'Bekijk',
    'common.edit': 'Bewerk',
    'common.delete': 'Verwijder',
    'common.add': 'Toevoegen',
    'common.save': 'Opslaan',
    'common.cancel': 'Annuleren',
    'common.refresh': 'Verversen',
    
    // Mold History Table
    'moldHistory.caption': 'Matrijs Historie',
    'moldHistory.mold': 'Matrijs',
    'moldHistory.machine': 'Machine',
    'moldHistory.start': 'Start',
    'moldHistory.end': 'Eind',
    'moldHistory.shots': 'Shots',
    'moldHistory.viewData': 'Bekijk data',
    'moldHistory.view': 'Bekijk',
    
    // Molds Page
    'molds.title': 'Levensduur matrijzen',
    'molds.description': 'Overzicht van alle matrijzen en hun levensduur',
    'molds.mold': 'Matrijs',
    'molds.boardPort': 'Board - Port',
    'molds.firstUsed': 'Eerste gebruik',
    'molds.lastUsed': 'Laatst gebruikt',
    'molds.lifetime': 'Levensduur',
    'molds.total': 'Totaal: {count} matrijzen',
    
    // Mechanics Page
    'mechanics.title': 'Monteurs',
    'mechanics.description': 'Hier kun je monteurs toevoegen, verwijderen en aanpassen.',
    'mechanics.name': 'Naam',
    'mechanics.specialization': 'Specialisatie',
    'mechanics.planning': 'planning',
    'mechanics.total': 'Totaal: {count} monteurs',
    'mechanics.dashboardTitle': 'Monteursdashboard',
    'mechanics.dashboardDescription': 'Toon geplande en afgeronde onderhoudstaken voor deze monteur.',
    'mechanics.dashboardLink': 'Dashboard',
    'mechanics.dashboardTotalsLabel': 'Overzicht',
    'mechanics.dashboardTotals': 'Aankomend: {upcoming} · Verleden: {past}',
    'mechanics.dashboardListTitle': 'Onderhoudstaken',
    'mechanics.dashboardListSubtitle': 'Kies een taak om details te bekijken.',
    
    // Maintenance Page
    'maintenance.title': 'Onderhoud',
    'maintenance.description': 'Plan hier het onderhoud van de machines.',
    'maintenance.mechanicDescription': 'Plan hier het onderhoud van de molds.',
    'maintenance.upcoming': 'Aankomende onderhoudsbeurten',
    'maintenance.past': 'Eerdere onderhoudsbeurten',
    'maintenance.upcomingShort': 'Aankomend',
    'maintenance.pastShort': 'Verleden',
    'maintenance.noUpcoming': 'Geen aankomende onderhoudstaken.',
    'maintenance.noPast': 'Geen eerdere onderhoudstaken.',
    'maintenance.detailsTitle': 'Onderhoudsdetails',
    'maintenance.noSelection': 'Selecteer een onderhoudsbeurt om details te zien.',
    'maintenance.status': 'Status',
    'maintenance.status.planned': 'Gepland',
    'maintenance.status.busy': 'Bezig',
    'maintenance.status.finished': 'Afgerond',
    'maintenance.start': 'Start onderhoud',
    'maintenance.finish': 'Onderhoud afgerond',
    'maintenance.statusUpdated': 'Onderhoudsstatus is bijgewerkt.',
    'maintenance.statusUpdateError': 'Kon onderhoudsstatus niet bijwerken.',
    'maintenance.loadError': 'Kon onderhoud niet ophalen.',
    
    // Milestones
    'milestones.title': 'Preventieve onderhoudsplanning',
    'milestones.description': 'Alle preventieve onderhoudsplanningen voor matrijzen',
    'milestones.caption': 'Welke type onderhoud bij hoeveel shots',
    'milestones.machineActive': 'Machine actief',
    'milestones.machine': 'Machine',
    'milestones.type': 'Type',
    'milestones.sendSms': 'SMS versturen',
    'milestones.milestone': 'Milestone / Total shots',
    'milestones.chooseMachine': 'Kies machine',
    // Calendar
    'calendar.maintenancePlanning': 'Onderhoudsplanning',
    'calendar.newPlanning': 'Nieuwe Planning',
    
    // Mechanics
    'mechanics.add': 'toevoegen',
    'mechanics.addMechanic': 'Monteur toevoegen',
    'mechanics.created': 'Monteur is aangemaakt',
    'mechanics.createError': 'Kon monteur niet aanmaken.',
     // Planning
    'planning.scheduleMaintenance': 'Onderhoud plannen',
    'planning.maintenanceScheduled': 'Onderhoud is ingepland.',
    'planning.maintenanceScheduleError': 'Kon onderhoud niet inplannen.',
    'planning.milestoneSet': 'Milestone is ingesteld.',
    'planning.milestoneSetError': 'Kon milestone niet instellen.',
    'planning.manual': 'Handmatig',
    'planning.predictive': 'Voorspellend',
    'planning.date': 'Datum',
    'planning.machine': 'Machine',
    'planning.selectOption': 'Selecteer een optie',
    'planning.lifespan': 'Levensduur',
    'planning.maintenanceType': 'Onderhoudstype',
    'planning.preventive': 'Preventief',
    'planning.corrective': 'Correctief',
    'planning.maintenanceAction': 'Onderhoudsactie',
    'planning.description': 'Beschrijving',
    'planning.mechanic': 'Monteur',
    'planning.schedule': 'Plannen',
    
    // Maintenance Actions
    'planning.actions.calibrate': 'Kalibreren',
    'planning.actions.clean': 'Poetsen',
    'planning.actions.inspect': 'Inspecteren',
    'planning.actions.lubricate': 'Smeren',
    'planning.actions.checkCooling': 'Koelingskanalen controleren',
    'planning.actions.cleanNozzle': 'Spuitneus reinigen',
    'planning.actions.tightenFasteners': 'Bevestigingen aanspannen',
    'planning.actions.checkHotRunner': 'Hot-runner controleren',
    'planning.actions.polish': 'Polijsten',
    'planning.actions.replaceSeals': 'Afdichtingen vervangen',
    'planning.actions.testClampForce': 'Sluitkracht testen',
    'planning.actions.reviseGuides': 'Geleiders reviseren',
    'planning.actions.inspectElectrical': 'Elektrische aansluitingen inspecteren',
    'planning.actions.degas': 'Ontgassen',
    'planning.actions.checkAlignment': 'Uitlijning controleren',
    'planning.actions.replaceWearStrips': 'Slijtstrippen vervangen',
    'planning.actions.checkTemperature': 'Temperatuurzones controleren',
     // Maintenance
    'maintenance.machine': 'Machine',
    'maintenance.plannedFor': 'Gepland voor',
    'maintenance.type': 'Onderhoudstype',
    'maintenance.preventive': 'Preventief',
    'maintenance.corrective': 'Correctief',
    'maintenance.action': 'Onderhoudsactie',
    'maintenance.assignedMechanic': 'Toegewezen monteur',
    'maintenance.selectOption': 'Selecteer een optie',
    'maintenance.updated': 'Onderhoudsplan is aangepast.',
    'maintenance.updateError': 'Kon onderhoud niet aanpassen.',
    'maintenance.actions.clean': 'Poetsen',
    'maintenance.actions.calibrate': 'Kalibreren',
    // Planning
    'planning.groupCreated': 'Groep aangemaakt.',
    'planning.groupCreateError': 'Kon groep niet aanmaken.',
    // Mechanics
    'mechanics.mechanicInfo': 'Monteurinformatie',
    'mechanics.updated': 'Monteur is aangepast.',
    'mechanics.updateError': 'Kon monteur niet aanpassen.',
    // Planning
    'planning.dateUpdated': 'Datum van onderhoudsbeurt is aangepast.',
    'planning.dateUpdateError': 'Kon datum van onderhoudsbeurt niet aanpassen.',
    'planning.nothingPlannedToday': 'Er is vandaag niks gepland.',
    'planning.route': 'Route',
    'planning.itemCount': '{count} {count, plural, one {item} other {items}}',
    'planning.maintenanceSession': 'Onderhoudsbeurt',
    'nav.notifications': 'Meldingen',
'machines.all': 'Alle machines',
'machines.history': 'Historische data',
'maintenance.calendar': 'Kalender',
'nav.settings': 'Instellingen',
'nav.factoryView': 'Factory View Mode',
"molds.historyTableTitle": "Matrijs Historie",
"machines.machine": "Machine",
"general.start": "Start",
"general.end": "Laatst aangepast",
"molds.shots": "Shots",
"general.viewData": "Bekijk data",
"general.view": "Bekijk",
"planning.timeSinceLastShot": "Tijd sinds laatste shot",
"general.total": "Totaal",
// Status translations
  "status.operational": "Operationeel",
  "status.standby": "Stand-by",
  "status.idle": "Inactief",
  "status.inactive": "Uitgeschakeld",
  "status.unknown": "Onbekende status",
    "machines.historyDescription": "Hier kun je de historische data van de machines bekijken",
    "machines.noMachinesForDate": "Geen machines voor de geselecteerde datum",
    "common.loading": "Laden…",
  },
  en: {
    "planning.timeSinceLastShot": "Time Since Last Shot",
    "general.total": "Total Shots",
    
    "machines.historyDescription": "Here you can view the historical data of the machines",
    "machines.noMachinesForDate": "No machines for the selected date",
    "common.loading": "Loading…",
  "status.operational": "Operational",
  "status.standby": "Standby",
  "status.idle": "Idle",
  "status.inactive": "Inactive",
  "status.unknown": "Status",
    "molds.historyTableTitle": "Mold History",
"machines.machine": "Machine",
"general.start": "Start",
"general.end": "Last Update",
"molds.shots": "Shots",
"general.viewData": "View Data",
"general.view": "Average Shot Time",
    'nav.notifications': 'Notifications',
'machines.all': 'All machines',
'machines.history': 'History data',
'maintenance.calendar': 'Calendar',
'nav.settings': 'Settings',
'nav.factoryView': 'Factory View Mode',
    // Planning
    'planning.dateUpdated': 'Maintenance date has been updated.',
    'planning.dateUpdateError': 'Could not update maintenance date.',
    'planning.nothingPlannedToday': 'Nothing planned today.',
    'planning.route': 'Route',
    'planning.itemCount': '{count} {count, plural, one {item} other {items}}',
    'planning.maintenanceSession': 'Maintenance Session',
    // Mechanics
    'mechanics.mechanicInfo': 'Mechanic Information',
    'mechanics.updated': 'Mechanic has been updated.',
    'mechanics.updateError': 'Could not update mechanic.',
    // Planning
    'planning.groupCreated': 'Group created.',
    'planning.groupCreateError': 'Could not create group.',
    // Maintenance
    'maintenance.machine': 'Machine',
    'maintenance.plannedFor': 'Planned for',
    'maintenance.type': 'Maintenance type',
    'maintenance.preventive': 'Preventive',
    'maintenance.corrective': 'Corrective',
    'maintenance.action': 'Maintenance action',
    'maintenance.assignedMechanic': 'Assigned mechanic',
    'maintenance.selectOption': 'Select an option',
    'maintenance.updated': 'Maintenance plan has been updated.',
    'maintenance.updateError': 'Could not update maintenance.',
    'maintenance.actions.clean': 'Clean',
    'maintenance.actions.calibrate': 'Calibrate',
    // Planning
    'planning.scheduleMaintenance': 'Schedule Maintenance',
    'planning.maintenanceScheduled': 'Maintenance has been scheduled.',
    'planning.maintenanceScheduleError': 'Could not schedule maintenance.',
    'planning.milestoneSet': 'Milestone has been set.',
    'planning.milestoneSetError': 'Could not set milestone.',
    'planning.manual': 'Manual',
    'planning.predictive': 'Predictive',
    'planning.date': 'Date',
    'planning.machine': 'Machine',
    'planning.selectOption': 'Select an option',
    'planning.lifespan': 'Lifespan',
    'planning.maintenanceType': 'Maintenance Type',
    'planning.preventive': 'Preventive',
    'planning.corrective': 'Corrective',
    'planning.maintenanceAction': 'Maintenance Action',
    'planning.description': 'Description',
    'planning.mechanic': 'Mechanic',
    'planning.schedule': 'Schedule',
    
    // Maintenance Actions
    'planning.actions.calibrate': 'Calibrate',
    'planning.actions.clean': 'Clean',
    'planning.actions.inspect': 'Inspect',
    'planning.actions.lubricate': 'Lubricate',
    'planning.actions.checkCooling': 'Check cooling channels',
    'planning.actions.cleanNozzle': 'Clean nozzle',
    'planning.actions.tightenFasteners': 'Tighten fasteners',
    'planning.actions.checkHotRunner': 'Check hot-runner',
    'planning.actions.polish': 'Polish',
    'planning.actions.replaceSeals': 'Replace seals',
    'planning.actions.testClampForce': 'Test clamp force',
    'planning.actions.reviseGuides': 'Revise guides',
    'planning.actions.inspectElectrical': 'Inspect electrical connections',
    'planning.actions.degas': 'Degas',
    'planning.actions.checkAlignment': 'Check alignment',
    'planning.actions.replaceWearStrips': 'Replace wear strips',
    'planning.actions.checkTemperature': 'Check temperature zones',
    // Mechanics
    'mechanics.add': 'add',
    'mechanics.addMechanic': 'Add Mechanic',
    'mechanics.created': 'Mechanic has been created',
    'mechanics.createError': 'Could not create mechanic.',
    // Calendar
    'calendar.maintenancePlanning': 'Maintenance Planning',
    'calendar.newPlanning': 'New Planning',
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.molds': 'Molds',
    'nav.machines': 'Machines',
    'nav.maintenance': 'Maintenance',
    'nav.mechanics': 'Mechanics',
    
    // Common
    'common.total': 'Total',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.na': 'N/A',
    'common.view': 'View',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.refresh': 'Refresh',
    
    // Mold History Table
    'moldHistory.caption': 'Mold History',
    'moldHistory.mold': 'Mold',
    'moldHistory.machine': 'Machine',
    'moldHistory.start': 'Start',
    'moldHistory.end': 'End',
    'moldHistory.shots': 'Shots',
    'moldHistory.viewData': 'View data',
    'moldHistory.view': 'View',
    
    // Molds Page
    'molds.title': 'Mold Lifetime',
    'molds.description': 'Overview of all molds and their lifetime',
    'molds.mold': 'Mold',
    'molds.boardPort': 'Board - Port',
    'molds.firstUsed': 'First used',
    'molds.lastUsed': 'Last used',
    'molds.lifetime': 'Lifetime',
    'molds.total': 'Total: {count} molds',
    
    // Mechanics Page
    'mechanics.title': 'Mechanics',
    'mechanics.description': 'Here you can add, remove and edit mechanics.',
    'mechanics.name': 'Name',
    'mechanics.specialization': 'Specialization',
    'mechanics.planning': 'planning',
    'mechanics.total': 'Total: {count} mechanics',
    'mechanics.dashboardTitle': 'Mechanic dashboard',
    'mechanics.dashboardDescription': 'View planned and past maintenances assigned to this mechanic.',
    'mechanics.dashboardLink': 'Dashboard',
    'mechanics.dashboardTotalsLabel': 'Overview',
    'mechanics.dashboardTotals': 'Upcoming: {upcoming} · Past: {past}',
    'mechanics.dashboardListTitle': 'Maintenance tasks',
    'mechanics.dashboardListSubtitle': 'Pick a task to view its full details.',
    
    // Maintenance Page
    'maintenance.title': 'Maintenance',
    'maintenance.description': 'Plan maintenance for machines here.',
    'maintenance.mechanicDescription': 'Plan maintenance for molds here.',
    'maintenance.upcoming': 'Upcoming maintenances',
    'maintenance.past': 'Past maintenances',
    'maintenance.upcomingShort': 'Upcoming',
    'maintenance.pastShort': 'Past',
    'maintenance.noUpcoming': 'No upcoming maintenances.',
    'maintenance.noPast': 'No past maintenances.',
    'maintenance.detailsTitle': 'Maintenance details',
    'maintenance.noSelection': 'Select a maintenance task to see the details.',
    'maintenance.status': 'Status',
    'maintenance.status.planned': 'Planned',
    'maintenance.status.busy': 'In progress',
    'maintenance.status.finished': 'Finished',
    'maintenance.start': 'Start maintenance',
    'maintenance.finish': 'Maintenance finished',
    'maintenance.statusUpdated': 'Maintenance status has been updated.',
    'maintenance.statusUpdateError': 'Could not update maintenance status.',
    'maintenance.loadError': 'Could not load mechanic maintenance.',
    
    // Milestones
    'milestones.title': 'Preventive Maintenance Planning',
    'milestones.description': 'All preventive maintenance schedules for machines',
    'milestones.caption': 'Which type of maintenance at how many shots',
    'milestones.machineActive': 'Machine active',
    'milestones.machine': 'Machine',
    'milestones.type': 'Type',
    'milestones.sendSms': 'Send SMS',
    'milestones.milestone': 'Milestone / Total shots',
    'milestones.chooseMachine': 'Choose machine',
  }
};

export function LanguageProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [language, setLanguage] = useState<Language>('nl');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load saved language preference
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'nl' || saved === 'en')) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    if (isClient) {
      localStorage.setItem('language', lang);
    }
  }, [isClient]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key as keyof typeof translations['nl']] || key;
    
    // Replace parameters like {count}
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        translation = translation.replace(`{${k}}`, String(v));
      }
    }
    
    return translation;
  }, [language]);
  const contextValue = useMemo(() => ({ language, setLanguage: changeLanguage, t }), [language, changeLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}