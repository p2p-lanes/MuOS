import { useApplication } from "@/providers/applicationProvider"
import { useCityProvider } from "@/providers/cityProvider"
import { usePassesProvider } from "@/providers/passesProvider"
import { useGroupsProvider } from "@/providers/groupsProvider"
import { ProductsProps } from "@/types/Products"
import { useMemo } from "react"
import { useTranslations } from "next-intl"

const useCalculateDiscount = (isPatreon: boolean, products: ProductsProps[]) => {
  const t = useTranslations('passes')
  const { discountApplied } = usePassesProvider()
  const { getCity } = useCityProvider()
  const city = getCity()
  const { getRelevantApplication } = useApplication()
  const { groups } = useGroupsProvider()
  const application = getRelevantApplication()
  const productCompare = useMemo(() => products.find(p => p.category === 'week' && p.price !== p.compare_price) ?? {price: 100, compare_price: 100}, [products])

  const {discount, label, isEarlyBird} = useMemo(() => {
    if (isPatreon) return {discount: 100, label: t('discounts.patronSupport')}
    
    if(!application) return {discount: 0, label: ''}

    if(application.group_id && groups.length > 0){
      const group = groups.find(g => g.id === application.group_id)
      if(group && group.discount_percentage && group.discount_percentage >= discountApplied.discount_value){
        return {discount: group.discount_percentage, label: t('discounts.groupDiscount', { percentage: group.discount_percentage })}
      }
    }
    
    if(discountApplied.discount_value){
      if(application.discount_assigned) return {discount: discountApplied.discount_value, label: t('discounts.specialDiscount', { percentage: discountApplied.discount_value })}
      return {discount: discountApplied.discount_value, label: t('discounts.codeDiscount', { percentage: discountApplied.discount_value })}
    }
    
    if(city?.ticketing_banner_description) return {discount: 0.01, label: city.ticketing_banner_description}
    
    const discount = 100 - ((productCompare.price ?? 0) / (productCompare.compare_price ?? 0) * 100)
    
    return {discount: Math.round(discount), label: t('discounts.earlyBird', { percentage: Math.round(discount) }), isEarlyBird: true}
  }, [isPatreon, application, productCompare, discountApplied, groups, t])

  return {discount, label, isEarlyBird}
}
export default useCalculateDiscount