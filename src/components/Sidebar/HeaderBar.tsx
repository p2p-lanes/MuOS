import { ChevronRight } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb"
import { SidebarTrigger } from "./SidebarComponents"
import { useCityProvider } from "@/providers/cityProvider"
import { usePathname, useRouter } from '@/i18n/navigation'
import { Fragment } from "react"
import useGroupMapping from "./hooks/useGroupMapping"
import BreadcrumbSegment from "./BreadcrumbSegment"
import LanguageSwitcher from "./LanguageSwitcher"

const HeaderBar = () => {
  const { getCity } = useCityProvider()
  const pathname = usePathname()
  const city = getCity()
  const router = useRouter()
  const { groupMapping, isLoading } = useGroupMapping()
  
  const handleClickCity = () => {
    router.push(`/portal/${city?.slug}`)
  }
  
  // Procesar la ruta
  const pathSegments = pathname.split('/').filter(Boolean).slice(2) // Eliminar los dos primeros elementos
  const pathsToDisplay = pathSegments.length > 0 ? pathSegments : ['application']

  

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white px-6 w-[100%]">
      <SidebarTrigger />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="cursor-pointer" onClick={handleClickCity}>
              {city?.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
  
          {pathsToDisplay.map((path, index) => (
            <Fragment key={index}>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbSegment 
                path={path} 
                isLoading={isLoading} 
                groupMapping={groupMapping} 
              />
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center">
        <LanguageSwitcher />
      </div>
    </header>
  )
}

export default HeaderBar