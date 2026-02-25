import { ButtonAnimated } from "@/components/ui/button"
import { usePassesProvider } from "@/providers/passesProvider";
import usePurchaseProducts from "../../../hooks/usePurchaseProducts";
import { useTranslations } from "next-intl";

const CompletePurchaseButton = ({edit, waiverAccepted = true}: {edit?: boolean, waiverAccepted?: boolean}) => {
  const t = useTranslations('passes')
  const { purchaseProducts, loading } = usePurchaseProducts();
  const { attendeePasses: attendees } = usePassesProvider()
  const someSelected = attendees.some(attendee => attendee.products.some(product => 
    product.selected && (product.purchased ? product.category === 'day' : true))
  )

  return (
    <ButtonAnimated
      disabled={loading || !someSelected || !waiverAccepted} 
      loading={loading} 
      className="w-full md:w-fit md:min-w-[120px] text-white bg-slate-800" 
      onClick={() => purchaseProducts(attendees)}
      data-purchase
    >
      {loading ? t('buttons.loading') : edit ? t('buttons.confirm') : t('buttons.confirmAndPay')}
    </ButtonAnimated>

  )
}
export default CompletePurchaseButton