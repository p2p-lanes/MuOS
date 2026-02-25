"use client";

import { api } from "@/api";
import { useCityProvider } from "@/providers/cityProvider";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type UseExportCsvReturn = {
  isExporting: boolean;
  handleExportCsv: () => Promise<void>;
};

const useExportCsv = (): UseExportCsvReturn => {
  const t = useTranslations('attendees')
  const { getCity } = useCityProvider();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCsv = useCallback(async (): Promise<void> => {
    const city = getCity();
    if (!city?.id) {
      toast.error(t('cityNotFound'));
      return;
    }

    const dismissId = toast.loading(t('preparingExport'));
    setIsExporting(true);
    try {
      const response = await api.get(
        `/applications/attendees_directory/${city.id}/csv`,
        { responseType: "blob" }
      );

      const blob: Blob = response.data as Blob;
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.download = `attendees-${city.name ?? "city"}-${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success(t('exportSuccess'), { id: dismissId });
    } catch (error: unknown) {
      console.error("Error exporting CSV:", error);
      toast.error(t('exportFailed'), { id: dismissId });
    } finally {
      setIsExporting(false);
    }
  }, [getCity, t]);

  return { isExporting, handleExportCsv };
};

export default useExportCsv;


