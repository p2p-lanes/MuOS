import SectionWrapper from "./SectionWrapper";
import { validateVideoUrl } from "@/helpers/validate";
import InputForm from "@/components/ui/Form/Input";
import { SectionProps } from "@/types/Section";
import { SectionSeparator } from "./section-separator";
import { dynamicForm } from "@/constants";
import { useCityProvider } from "@/providers/cityProvider";
import TextAreaForm from "@/components/ui/Form/TextArea";

const fieldsProfessionalDetails = ["organization", "role", "social_media", "experience_goals", "proud_projects", "other_interests"]

export function ProfessionalDetailsForm({ formData, errors, handleChange, fields }: SectionProps) {
  const { getCity } = useCityProvider()
  const city = getCity()
  // const isVideoValid = validateVideoUrl(formData.video_url, fields)

  if (!fields || !fields.size || !fieldsProfessionalDetails.some(field => fields.has(field))) return null;

  const form = dynamicForm[city?.slug ?? '']

  return (
    <>
      <SectionWrapper title={form?.professional_details?.title ?? "We want to know you!"} subtitle={form?.professional_details?.subtitle ?? "Tell us about your professional background and current role."}>
        <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
          {fields.has("organization") && (
            <InputForm
              label="Organization / School you’re at"
              id="organization"
              value={formData.organization ?? ''}
              onChange={(value: string) => handleChange('organization', value)}
              error={errors.organization}
              isRequired={true}
              subtitle="If you&apos;re just exploring something independently, note that."
            />
          )}
          {fields.has("role") && (
            <InputForm
              label="Role in the organization"
              id="role"
              value={formData.role ?? ''}
              onChange={(value: string) => handleChange('role', value)}
              error={errors.role}
              isRequired={true}
              subtitle="Job title or a 1-sentence description."
            />
          )}
        </div>

        {fields.has("current_building") && (
          <div className="w-full mt-4">
            <TextAreaForm
              label="What are you currently building / working on/ reaching or obsessed in?"
              id="current_building"
              value={formData.current_building ?? ''}
              handleChange={(value: string) => handleChange('current_building', value)}
              error={errors.current_building}
              isRequired={true}
            />
          </div>
        )}

        {fields.has("github_profile") && (
          <InputForm
            label="Your GitHub profile"
            id="github_profile"
            value={formData.github_profile ?? ''}
            onChange={(value: string) => handleChange('github_profile', value)}
            error={errors.github_profile}
            isRequired={true}
            subtitle="Show us what you are working on!"
          />
        )}

        {fields.has("area_of_expertise") && (
          <InputForm
            label="Areas of Expertise"
            id="area_of_expertise"
            value={formData.area_of_expertise ?? ''}
            onChange={(value: string) => handleChange('area_of_expertise', value)}
            error={errors.area_of_expertise}
            isRequired={true}
            subtitle=" Please list your top professional skills, areas of expertise, and/or spheres of influence (i.e. sustainable energy, AI R&D, neuropsychology and BMIs, cryptocurrency and blockchain development, etc)."
          />
        )}

        {fields.has("experience_goals") && (
          <TextAreaForm
            label="What excites you about muShanghai? What are you planning to build / achieve / learn from this experience?"
            id="experience_goals"
            value={formData.experience_goals ?? ''}
            handleChange={(value: string) => handleChange('experience_goals', value)}
            error={errors.experience_goals}
            isRequired={true}
          />
        )}

        {fields.has("proud_projects") && (
          <TextAreaForm
            label="What Projects or Achievement are you super proud of in the past?"
            id="proud_projects"
            value={formData.proud_projects ?? ''}
            handleChange={(value: string) => handleChange('proud_projects', value)}
            error={errors.proud_projects}
            isRequired={true}
          />
        )}

        {fields.has("other_interests") && (
          <TextAreaForm
            label="What else are you in to?"
            id="other_interests"
            value={formData.other_interests ?? ''}
            handleChange={(value: string) => handleChange('other_interests', value)}
            error={errors.other_interests}
            isRequired={true}
          />
        )}
      </SectionWrapper>
      <SectionSeparator />
    </>
  )
}

