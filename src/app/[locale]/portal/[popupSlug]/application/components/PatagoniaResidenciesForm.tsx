'use client'

import { useCityProvider } from "@/providers/cityProvider";
import { SectionProps } from "@/types/Section";
import { dynamicForm } from "@/constants";
import SectionWrapper from "./SectionWrapper";
import { useEffect, useState } from "react";
import { api } from "@/api";
import TextAreaForm from "@/components/ui/Form/TextArea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SectionSeparator } from "./section-separator";
import { useTranslations } from "next-intl";

const fieldsPatagoniaResidencies = ["patagonia_residencies"]

const PatagoniaResidenciesForm = ({ formData, errors, handleChange, fields }: SectionProps) => {
  const t = useTranslations('applicationForm')
  const [residencies, setResidencies] = useState<{ value: string; label: string }[]>([])
  const hasPatagoniaResidencies = !(!fields || !fields.size || !fieldsPatagoniaResidencies.some(field => fields?.has(field)))
  
  const animationProps = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  };
  
  useEffect(() => {
    if(hasPatagoniaResidencies){
      api.get('applications/residencies').then((res) => {
        const formattedResidencies = res.data.map((residency: string) => ({
          value: residency,
          label: residency
        }))
        setResidencies(formattedResidencies)
      })
    }
  }, [hasPatagoniaResidencies])

  useEffect(() => {
    if(formData.residencies_interested_in && formData.residencies_interested_in.length > 0){
      handleChange('interested_in_residency', true)
    }
  }, [])

  if (!hasPatagoniaResidencies) return null;

  
  return (
    <>
    <SectionWrapper title={t('patagoniaTitle')} subtitle={t('patagoniaSubtitle')}>
      <div className="grid gap-4 grid-cols-1 sm:items-end">
              <div className="w-full flex flex-col gap-4">
                  <TextAreaForm
                    label={t('describeWork')}
                    id="residencies_text"
                    value={formData.residencies_text ?? ''}
                    handleChange={(value) => handleChange('residencies_text', value)}
                    error={errors.residencies_text}
                  />

                <Label className="text-sm text-gray-500">
                  {t('findResidencies')}{' '}
                  <Link href="https://edgecity.notion.site/Edge-City-Patagonia-Residency-Application-updated-regularly-240d45cdfc5980e980f8db7d362c553d" target="_blank" className="text-blue-500">
                    {t('here')}
                  </Link>.
                </Label>
                <Label className="text-sm text-gray-500">
                  {t('submitProposal')}{' '}
                  <Link href="https://guildhall.simplefi.tech/dashboard/#/nc/form/8d445476-f4d6-4dc9-bb0d-7a8f234f6b33" target="_blank" className="text-blue-500">
                    {t('here')}
                  </Link>.
                </Label>
              </div>
      </div>

    </SectionWrapper>
      <SectionSeparator />
    </>
  )
}
export default PatagoniaResidenciesForm
