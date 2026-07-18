import SEO from '../../components/SEO'
import { BRAND } from '../../data'

export default function TermsPage() {
  return (
    <>
      <SEO title="Terms of Service"/>
      <section className="pt-36 pb-8" style={{background:'#0A1628'}}>
        <div className="container-pad"><h1 className="font-display font-bold text-white text-4xl">Terms of Service</h1><p className="mt-2 text-sm" style={{color:'rgba(255,255,255,0.4)'}}>Last updated: January 2026</p></div>
      </section>
      <section className="py-16" style={{background:'#070D1A'}}>
        <div className="container-pad max-w-3xl">
          <div className="rounded-2xl p-8 space-y-6 text-sm leading-relaxed" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.6)'}}>
            {[
              ['Acceptance', 'By engaging the services of Apex Getaways & Travel LTD, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.'],
              ['Our Role', 'Apex Getaways & Travel LTD acts as a travel services intermediary, arranging flights, hotels, visas, transfers and other services on your behalf through airlines, hotels, and third-party providers. We are not the direct provider of transportation, accommodation, or visa decisions.'],
              ['Bookings & Payments', 'All bookings are subject to availability and confirmation. A deposit or full payment may be required to secure your booking. Full payment is due before travel documents are issued. Payment plans are available subject to terms agreed at booking.'],
              ['Cancellations & Refunds', 'Cancellation requests must be submitted in writing to our team. Cancellation charges from airlines, hotels, and suppliers will apply as per their individual policies. Our service fees may be non-refundable. Processing times vary by provider. We recommend travel insurance for all bookings.'],
              ['Visa Decisions', 'Apex Getaways provides visa application assistance but cannot guarantee visa approvals. Visa decisions rest solely with the relevant embassy or immigration authority. Our service fees for visa assistance are non-refundable regardless of the outcome.'],
              ['Client Responsibilities', 'Clients are responsible for: ensuring their passport is valid (minimum 6 months), complying with all destination entry requirements, providing accurate documentation, and travelling with all required documents. We are not liable for denied boarding or entry due to inadequate documentation.'],
              ['Liability', 'Our liability is limited to the value of our service fees. We are not liable for actions or omissions of airlines, hotels, visa authorities, or other third-party providers.'],
              ['Contact', `For any queries regarding these terms: ${BRAND.email} · ${BRAND.phone}`],
            ].map(([title, text])=>(
              <div key={title}><h2 className="font-display font-bold text-white text-lg mb-2">{title}</h2><p>{text}</p></div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
