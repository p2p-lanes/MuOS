'use client'

import SectionWrapper from "./SectionWrapper";
import InputForm, { AddonInputForm } from "@/components/ui/Form/Input";
import SelectForm from "@/components/ui/Form/Select";
import { SectionProps } from "@/types/Section";
import { SectionSeparator } from "./section-separator";
import { useCityProvider } from "@/providers/cityProvider";
import { dynamicForm } from "@/constants";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { ageOptions } from "../constants/forms";
import { useEffect, useState } from 'react';
import { GENDER_OPTIONS } from "@/constants/util";
import { useTranslations } from "next-intl";

const fieldsPersonalInformation = ["first_name", "last_name", "email", "gender", "age", "telegram", "residence", "eth_address", "referral", "local_resident", "info_not_shared"]

export function PersonalInformationForm({ formData, errors, handleChange, fields }: SectionProps) {
  const t = useTranslations('applicationForm')
  const { getCity } = useCityProvider()
  const city = getCity()
  const [genderSpecify, setGenderSpecify] = useState('')

  useEffect(() => {
    if (formData.gender && formData.gender !== '' && !GENDER_OPTIONS.some(opt => opt.value === formData.gender)) {
      handleChange('gender_specify', formData.gender);
      handleChange('gender', 'Specify');
    }
  }, [formData.gender]);

  const animationProps = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  };

  if (!fields || !fields.size || !fieldsPersonalInformation.some(field => fields.has(field))) return null;
  const form = dynamicForm[city?.slug ?? '']

  return (
    <>
    <SectionWrapper title={t('personalInfoTitle')} subtitle={t('personalInfoSubtitle')}>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.has("first_name") && (
          <InputForm
            label={t('firstName')}
            id="first_name"
            value={formData.first_name}
            onChange={(value) => handleChange('first_name', value)}
            error={errors.first_name}
            isRequired={true}
          />
        )}
        {fields.has("last_name") && (
          <InputForm
            label={t('lastName')}
            id="last_name"
            value={formData.last_name}
            onChange={(value) => handleChange('last_name', value)}
            error={errors.last_name}
            isRequired={true}
          />
        )}
        {fields.has("email") && (
          <InputForm
            label={t('email')}
            id="email"
            value={formData.email ?? ''}
            onChange={(value) => handleChange('email', value)}
            error={errors.email}
            isRequired={true}
          />
        )}
        {fields.has("telegram") && (
          <AddonInputForm
            label={t('telegramUsername')}
            id="telegram"
            value={formData.telegram}
            onChange={(value) => handleChange('telegram', value)}
            error={errors.telegram}
            isRequired={true}
            subtitle={t('telegramSubtitle', { cityName: city?.name ?? '' })}
            addon="@"
            placeholder="username"
          />
        )}
        {fields.has("residence") && (
          <InputForm
            label={t('residence')}
            id="residence"
            value={formData.residence ?? ''}
            onChange={(value) => handleChange('residence', value)}
            error={errors.residence}
            isRequired={true}
            placeholder={form?.personal_information?.residence_placeholder ?? "Healdsburg, California, USA"}
            subtitle={t('residenceSubtitle')}
          />
        )}
        
        <div className="flex flex-col gap-4 w-full">
          {fields.has("gender") && (
            <SelectForm 
              label={t('gender')}
              id="gender"
              value={(formData.gender && formData.gender !== '' && !GENDER_OPTIONS.some(opt => opt.value === formData.gender)) ? 'Specify' : formData.gender}
              onChange={(value) => handleChange('gender', value)}
              error={errors.gender}
              isRequired={true}
              options={GENDER_OPTIONS}
            />
          )}

          <AnimatePresence>
            {formData.gender === 'Specify' && (
              <motion.div {...animationProps}>
                <InputForm
                  isRequired
                  label={t('specifyGender')}
                  id="gender_specify"
                  value={formData.gender_specify?.split(' - ')[1] ?? ''}
                  onChange={(e) => handleChange('gender_specify', `SYO - ${e}`)}
                  error={errors.gender_specify}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {fields.has("age") && (
          <div className="flex flex-col">
            <SelectForm 
              label={t('age')}
              id="age"
              value={formData.age}
              onChange={(value) => handleChange('age', value)}
              error={errors.age}
              isRequired={true}
              options={ageOptions}
            />
          </div>
        )}

        {fields.has("referral") && (
          <InputForm
            label={t('referral')}
            id="referral"
            value={formData.referral ?? ''}
            onChange={(value) => handleChange('referral', value)}
            error={errors.referral}
            isRequired={false}
            subtitle={t('referralSubtitle')}
          />
        )}

        {fields.has("eth_address") && (
          <InputForm
            label={t('ethAddress')}
            id="eth_address"
            value={formData.eth_address ?? ''}
            onChange={(value) => handleChange('eth_address', value)}
            error={errors.eth_address}
            isRequired={false}
            placeholder="0x..."
            subtitle={t('ethSubtitle')}
          />
        )}
      </div>

      {fields.has("local_resident") && (
        <div style={{ marginTop: '24px' }}>
          <SelectForm
            label={form?.personal_information?.local_resident_title || t('latamCitizen')}
            id="local_resident"
            value={formData.local_resident === null ? "" : formData.local_resident === true ? "yes" : "no"}
            onChange={(value) => handleChange("local_resident", value === "yes" ? true : false)}
            error={errors.local_resident}
            isRequired
            placeholder={t('selectPlaceholder')}
            options={[
              { value: "yes", label: t('yes') },
              { value: "no", label: t('no') },
            ]}
          />  
        </div>
      )}


      {/* {fields.has("info_not_shared") && (
        <FormInputWrapper>
          <Label>
            Info I&apos;m <strong>NOT</strong> willing to share with other attendees
            <p className="text-sm text-muted-foreground mb-2">
              We will make a directory to make it easier for attendees to coordinate
            </p>
          </Label>
          <div className="space-y-2 ">
            <MultiSelect options={shareableInfo} onChange={(selected) => handleChange('info_not_shared', selected)} defaultValue={formData.info_not_shared}/>
          </div>
        </FormInputWrapper>
      )} */}
      </SectionWrapper>
      <SectionSeparator />
    </>
  )
}

