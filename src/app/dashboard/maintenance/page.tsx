"use client";

import PlanningCalendar from "@/components/PlanningCalendar";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Header from "../header";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Page() {
  const { t } = useLanguage();

  return (
    <DndProvider backend={HTML5Backend}>
      <Header
        title={t("maintenance.title")}
        description={t("maintenance.description")}
      />
      <PlanningCalendar mechanic={null} />
    </DndProvider>
  );
}
