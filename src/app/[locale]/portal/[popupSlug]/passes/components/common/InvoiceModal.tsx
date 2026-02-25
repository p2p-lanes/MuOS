import Modal from "@/components/ui/modal"
import PaymentHistory from "../Payments/PaymentHistory"
import useGetPaymentsData from "@/hooks/useGetPaymentsData"
import { useTranslations } from "next-intl"

const InvoiceModal = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
  const t = useTranslations('passes')
  const { payments } = useGetPaymentsData()

  return (
    <Modal open={isOpen} onClose={onClose} title={t('invoiceModal.title')} className="max-w-600px">
      <div className="max-h-[500px] overflow-y-auto">
        <PaymentHistory payments={payments} />
      </div>
    </Modal>
  )
}
export default InvoiceModal