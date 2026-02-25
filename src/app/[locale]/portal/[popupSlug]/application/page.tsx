"use client"

import { ButtonAnimated } from "@/components/ui/button"
import { useFormValidation } from "@/hooks/useFormValidation"
import { toast } from "sonner"
import { Loader } from '@/components/ui/Loader'
import { ExistingApplicationCard } from './components/existing-application-card'
import { FormHeader } from './components/form-header'
import { SectionSeparator } from './components/section-separator'
import { PersonalInformationForm } from './components/personal-information-form'
import { ProfessionalDetailsForm } from './components/professional-details-form'
import { ParticipationForm } from './components/participation-form'
import { ChildrenPlusOnesForm } from './components/children-plus-ones-form'
import { ScholarshipForm } from './components/scholarship-form'
import { ProgressBar } from './components/progress-bar'
import useSavesForm from './hooks/useSavesForm'
import useProgress from './hooks/useProgress'
import { initial_data } from './helpers/constants'
import useInitForm from './hooks/useInitForm'
import { useCityProvider } from "@/providers/cityProvider"
import { useEffect, useState } from "react"
import { useRouter } from "@/i18n/navigation"
import AccomodationForm from "./components/AccomodationForm"
import { useApplication } from "@/providers/applicationProvider"
import useGetFields from "./hooks/useGetFields"
import PatagoniaResidenciesForm from "./components/PatagoniaResidenciesForm"
import { MultiSelect } from "@/components/ui/MultiSelect"
import { getShareableInfo } from "./constants/forms"
import SectionWrapper from "./components/SectionWrapper"
import { useTranslations } from "next-intl"
import { FormInputWrapper } from "@/components/ui/form-input-wrapper"

export default function FormPage() {
  const t = useTranslations('applicationForm')
  const [statusBtn, setStatusBtn] = useState({loadingDraft: false, loadingSubmit: false})
  const { formData, errors, handleChange, validateForm, setFormData } = useFormValidation(initial_data)
  const { isLoading: isLoadingForm, showExistingCard, existingApplication, setShowExistingCard } = useInitForm(setFormData)
  const { handleSaveForm, handleSaveDraft } = useSavesForm()
  const { getCity } = useCityProvider()
  const { getRelevantApplication } = useApplication()
  const { fields } = useGetFields()
  const progress = useProgress(formData)
  const city = getCity()
  const application = getRelevantApplication()
  const router = useRouter()
  const shareableInfo = getShareableInfo(t)

  useEffect(() => {
    if(city && city.slug && fields?.size === 0) {
      router.push(`/portal/${city?.slug}`)
      return;
    }
    if(application && (application.status === 'accepted' || application.status === 'rejected')) {
      router.push(`/portal/${city?.slug}`)
    }
  }, [application, city, fields])

  const handleImport = async () => {
    if (existingApplication && fields) {
      const filteredData = Object.fromEntries(
        Object.entries(existingApplication).filter(([key]) => fields.has(key) && key !== 'local_resident')
      );
      setFormData(filteredData as Record<string, any>);
      setShowExistingCard(false);
      toast.success(t('importSuccess'));
    }
  }

  const handleCancelImport = () => {
    setShowExistingCard(false);
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setStatusBtn({loadingDraft: false, loadingSubmit: true})
    const formValidation = validateForm()
    if (formValidation.isValid) {
      const response = await handleSaveForm(formData)
    } else {
      const missingFields = formValidation.errors.map(error => error.field).join(', ')
      toast.error(t('errorTitle'), {
        description: t('fillRequiredFields', { fields: missingFields }),
      })
    }
    setStatusBtn({loadingDraft: false, loadingSubmit: false})
  }

  const handleDraft = async() => {
    setStatusBtn({loadingDraft: true, loadingSubmit: false})
    await handleSaveDraft(formData)
    setStatusBtn({loadingDraft: false, loadingSubmit: false})
  }

  if (isLoadingForm || !city) {
    return <Loader />
  }

  if(!fields || !fields.size) return null

  return (
    <main className="container py-6 md:py-12 mb-8">
      {showExistingCard && existingApplication && (
        <ExistingApplicationCard onImport={handleImport} onCancel={handleCancelImport} data={existingApplication} />
      )}
      <form onSubmit={handleSubmit} className="space-y-8 px-8 md:px-12">
        <FormHeader />
        <SectionSeparator />

        <PersonalInformationForm formData={formData} errors={errors} handleChange={handleChange} fields={fields}/>
        
        <ProfessionalDetailsForm formData={formData} errors={errors} handleChange={handleChange} fields={fields}/>

        <ParticipationForm formData={formData} errors={errors} handleChange={handleChange} fields={fields}/>

        <PatagoniaResidenciesForm formData={formData} errors={errors} handleChange={handleChange} fields={fields}/>

        <ChildrenPlusOnesForm formData={formData} errors={errors} handleChange={handleChange} fields={fields}/>

        <ScholarshipForm formData={formData} errors={errors} handleChange={handleChange} fields={fields}/>

        <AccomodationForm formData={formData} errors={errors} handleChange={handleChange} fields={fields}/>

        <SectionWrapper title={t('infoNotSharedTitle')} subtitle={t('infoNotSharedSubtitle')}>

            <FormInputWrapper>
              <div className="space-y-2 ">
                <MultiSelect options={shareableInfo} onChange={(selected) => handleChange('info_not_shared', selected)} defaultValue={formData.info_not_shared as string[]}/>
              </div>
            </FormInputWrapper>
        </SectionWrapper>


        
        <div className="flex flex-col w-full gap-6 md:flex-row justify-between items-center pt-6">
          <ButtonAnimated loading={statusBtn.loadingDraft} disabled={statusBtn.loadingSubmit} variant="outline" type="button" onClick={handleDraft} className="w-full md:w-auto">{t('saveAsDraft')}</ButtonAnimated>
          <ButtonAnimated loading={statusBtn.loadingSubmit} disabled={statusBtn.loadingDraft} type="submit" className="w-full md:w-auto">{t('submit')}</ButtonAnimated>
        </div>


      </form>
      <ProgressBar progress={progress} />
    </main>
  )
}

