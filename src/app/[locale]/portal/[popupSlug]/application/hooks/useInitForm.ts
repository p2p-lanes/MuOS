import { useEffect, useState } from "react";
import { toast } from "sonner";
import useGetData from "./useGetData";
import { useCityProvider } from "@/providers/cityProvider";
import { useTranslations } from "next-intl";

const useInitForm = (setFormData: any) => {
  const t = useTranslations('applicationForm')
  const [isLoading, setIsLoading] = useState(true)
  const [showExistingCard, setShowExistingCard] = useState(false)
  const [existingApplication, setExistingApplication] = useState<any>(null)
  const { getDataApplicationForm } = useGetData()
  const { getCity, getPopups } = useCityProvider()
  const city = getCity()
  const popups = getPopups()

  useEffect(() => {
    const initializeForm = async () => {
      setIsLoading(true)
      try {
        const { application, status } = await getDataApplicationForm()

        if(!application || !status) return

        if (status === 'import') {
          setExistingApplication(application);
          setShowExistingCard(true);
        }

        if (status === 'draft') {
          setFormData((prevData: any) => ({
            ...prevData,
            ...application
          }));
        }
      } catch (error) {
        console.error("Error initializing form:", error);
        toast.error(t('errorTitle'), {
          description: t('toastLoadingErrorDescription'),
        });
      } finally {
        setIsLoading(false)
      }
    }

    initializeForm();
  }, [city, popups]);

  return { isLoading, showExistingCard, existingApplication, setShowExistingCard }
}
export default useInitForm