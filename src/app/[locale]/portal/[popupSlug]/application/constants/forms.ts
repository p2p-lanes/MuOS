export const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Specify", label: "Specify own gender" },
  { value: "Prefer not to say", label: "Prefer not to say" },
]

export const getShareableInfo = (t: (key: string) => string) => [
  { value: "first_name", label: t('shareFirstName') },
  { value: "last_name", label: t('shareLastName') },
  { value: "email", label: t('shareEmail') },
  { value: "telegram", label: t('shareTelegram') },
  { value: "participation", label: t('shareParticipation') },
  { value: "brings_kids", label: t('shareKids') },
  { value: 'role', label: t('shareRole') },
  { value: 'organization', label: t('shareOrganization') },
  { value: 'personal_goals', label: t('sharePersonalGoals') },
  { value: 'residence', label: t('shareResidence') },
]

export const ageOptions = [
  { value: "18-24", label: "18-24" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45-54", label: "45-54" },
  { value: "55+", label: "55+" },
]