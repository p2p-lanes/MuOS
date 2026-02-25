'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SectionWrapper from "./SectionWrapper"
import { validateVideoUrl } from "@/helpers/validate"
import { SectionProps } from "@/types/Section"
import RadioGroupForm from "@/components/ui/Form/RadioGroup"
import CheckboxForm from "@/components/ui/Form/Checkbox"
import CardVideo from "./CardVideo"
import TextAreaForm from "@/components/ui/Form/TextArea"
import { SectionSeparator } from "./section-separator"
import { useCityProvider } from "@/providers/cityProvider"
import { dynamicForm } from "@/constants"
import { formatDate} from "@/helpers/dates"
import { useTranslations } from "next-intl"

const fieldsParticipation = ["duration", "builder_boolean", "builder_description", "hackathon_interest", "investor", "video_url", "personal_goals", "host_session"]

export function ParticipationForm({ formData, errors, handleChange, fields }: SectionProps) {
  const t = useTranslations('applicationForm')
  const [isBuilder, setIsBuilder] = useState(formData.builder_boolean || false)
  const isVideoValid = validateVideoUrl(formData.video_url)
  const { getCity } = useCityProvider()
  const city = getCity()

  const form = dynamicForm[city?.slug ?? '']
  const dates = `${formatDate(city?.start_date, {day: 'numeric', month: 'short'})} - ${formatDate(city?.end_date, {day: 'numeric', month: 'short', year: 'numeric'})}`
  const isBhutan = city?.slug === 'edge-bhutan-2025'
  
  const animationProps = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0},
    transition: { duration: 0.2, ease: "easeIn" }
  };

  const durationOptions = [
    { value: "week 1", label: t('durationWeek1') },
    { value: "week 2", label: t('durationWeek2') },
    { value: "week 3", label: t('durationWeek3') },
    { value: "week 4", label: t('durationWeek4') },
    { value: "a few days", label: t('durationFewDays') },
    { value: "full length", label: t('durationFullLength') },
  ]

  if (!fields || !fields.size || !fieldsParticipation.some(field => fields.has(field))) return null;

  return (
    <>
      <SectionWrapper 
        title={form?.participation?.title ?? t('participationTitle')} 
        subtitle={form?.participation?.subtitle ?? t('participationSubtitle')}
      >

        
        {
          isBhutan && (
            <CheckboxForm
              title={t('availability')}
              label={t('bhutanAvailabilityLabel')}
              subtitle={t('bhutanAvailabilitySubtitle')}
              id="duration"
              required={true}
              checked={formData.duration === 'full length' || false}
              onCheckedChange={(checked) => handleChange('duration', checked ? 'full length' : '')}
            />
          )
        }

        {
          !isBhutan && fields.has('duration') && (
            <RadioGroupForm
              label={t('duration')}
              subtitle={t('durationSubtitle')}
              value={formData.duration}
              onChange={(value) => handleChange('duration', value)}
              error={errors.duration}
              isRequired={!isVideoValid}
              options={durationOptions}
            />
          )
        }

        {
          fields.has("builder_boolean") && (
            <>
              <CheckboxForm
                label={t('builderBoolean', { cityName: city?.name ?? '' })}
                id="builder_boolean"
                checked={isBuilder}
                onCheckedChange={(checked) => {
                  setIsBuilder(checked === true)
                  handleChange('builder_boolean', checked === true)
                }}
              />
              <AnimatePresence>
                {isBuilder && fields.has("builder_description") && (
                  <motion.div {...animationProps}>
                    <TextAreaForm
                      label={t('builderDescription')}
                      id="builder_description"
                      value={formData.builder_description ?? ''}
                      error={errors.builder_description}
                      handleChange={(value) => handleChange('builder_description', value)}
                      isRequired={!isVideoValid}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
          </>  
        )}

        {
          fields.has("hackathon_interest") && (
            <CheckboxForm
              label={t('hackathonInterest', { cityName: city?.name ?? '' })}
              id="hackathon_interest"
              checked={formData.hackathon_interest || false}
              onCheckedChange={(checked) => handleChange('hackathon_interest', checked === true)}
            />
          )
        }

        {
          fields.has("investor") && (
            <CheckboxForm
              label={t('investor')}
              id="investor"
              checked={formData.investor || false}
              onCheckedChange={(checked) => handleChange('investor', checked === true)}
            />
          )
        }

        {
          fields.has("video_url") && (
            <CardVideo videoUrl={formData.video_url} setVideoUrl={(url) => handleChange('video_url', url)} />
          )
        }

        {
          fields.has("personal_goals") && (
            <TextAreaForm
              label={t('personalGoals', { cityName: city?.name ?? '' })}
              id="goals"
              value={formData.personal_goals ?? ''}
              error={errors.personal_goals}
              handleChange={(value) => handleChange('personal_goals', value)}
            />
          )
        }

        {
          isBhutan && (
            <TextAreaForm
              label={t('bhutanGoals')}
              id="goals"
              value={formData.personal_goals ?? ''}
              error={errors.personal_goals}
              handleChange={(value) => handleChange('personal_goals', value)}
            />
          )
        }

        {
          isBhutan && (
            <TextAreaForm
              label={t('bhutanContribute')}
              id="host_session"
              value={formData.host_session ?? ''}
              error={errors.host_session}
              handleChange={(value) => handleChange('host_session', value)}
            />
          )
        }


        {
          fields.has("host_session") && (
            <TextAreaForm
              label={t('hostSession', { cityName: city?.name ?? '' })}
              subtitle={t('hostSessionSubtitle')}
              id="host_session"
              value={formData.host_session ?? ''}
              error={errors.host_session}
              handleChange={(value) => handleChange('host_session', value)}
            />
          )
        }
      </SectionWrapper>

      <SectionSeparator />
    </>
  )
}
