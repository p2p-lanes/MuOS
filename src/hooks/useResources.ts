import { useApplication } from "@/providers/applicationProvider"
import { useCityProvider } from "@/providers/cityProvider"
import { Resource } from "@/types/resources"
import { FileText, Home, Ticket, Users } from "lucide-react"
import { useTranslations } from "next-intl"

const useResources = () => {
  const t = useTranslations('resources')
  const { getCity } = useCityProvider()
  const { getRelevantApplication } = useApplication()
  const application = getRelevantApplication()
  const city = getCity()

  const isEdge = city?.slug === 'edge-esmeralda' || city?.slug === 'buenos-aires'
  const applicationAccepted = application?.status === 'accepted'
  const canSeeAttendees = applicationAccepted

  const resources: Resource[] = [
    {
      name: t('application'),
      icon: FileText,
      status: 'active',
      path: `/portal/${city?.slug}`,
      children: [
        {
          name: t('status'),
          status: 'inactive',
          value: application?.status ?? t('notStarted')
        }
      ]
    },
    {
      name: t('passes'),
      icon: Ticket,
      status: applicationAccepted ? 'active' : 'disabled',
      path: `/portal/${city?.slug}/passes`,
      children: [
        {
          name: t('zkEmailDiscounts'),
          status: isEdge && applicationAccepted ? 'active' : !applicationAccepted ? 'disabled' : 'hidden',
          path: `/portal/${city?.slug}/coupons`
        }
      ]
    },
    {
      name: t('attendeeDirectory'), 
      icon: Users,
      status: canSeeAttendees ? 'active' : 'hidden',
      path: `/portal/${city?.slug}/attendees`,
    },
  ]

  return ({resources})
}
export default useResources
