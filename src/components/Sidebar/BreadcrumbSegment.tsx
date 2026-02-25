import { Loader2 } from "lucide-react"
import { BreadcrumbItem, BreadcrumbLink } from "../ui/breadcrumb"
import { useTranslations } from "next-intl"

interface BreadcrumbSegmentProps {
  path: string
  isLoading?: boolean
  groupMapping?: Record<string, string>
}

const BreadcrumbSegment = ({ path, isLoading, groupMapping }: BreadcrumbSegmentProps) => {
  const t = useTranslations('sidebar')
  // Verificar si este path corresponde a un ID de grupo y tenemos un mapping para él
  const isGroupId = groupMapping && Object.keys(groupMapping).includes(path)
  const displayText = isGroupId ? groupMapping[path] : path
  
  // Capitalizar primera letra
  const formattedText = typeof displayText === 'string' 
    ? displayText.charAt(0).toUpperCase() + displayText.slice(1) 
    : displayText

  return (
    <BreadcrumbItem>
      {isLoading && isGroupId ? (
        <div className="flex items-center">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          <BreadcrumbLink>{t('loading')}</BreadcrumbLink>
        </div>
      ) : (
        <BreadcrumbLink>{formattedText}</BreadcrumbLink>
      )}
    </BreadcrumbItem>
  )
}

export default BreadcrumbSegment 