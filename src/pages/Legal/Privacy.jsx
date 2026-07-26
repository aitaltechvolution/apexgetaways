import SEO from '../../components/SEO'
import { BRAND } from '../../data'

export default function PrivacyPage() {
  return (
    <>
      <SEO title="Privacy Policy"/>
      <section className="pt-36 pb-8" style={{background:'#F8F6F2'}}>
        <div className="container-pad"><h1 className="font-display font-bold text-primary text-4xl">Privacy Policy</h1><p className="mt-2 text-base" style={{color:'#4B5563'}}>Last updated: January 2026</p></div>
      </section>
      <section className="py-16" style={{background:'#FFFFFF'}}>
        <div className="container-pad max-w-3xl">
          <div className="rounded-2xl p-8 space-y-6 text-base leading-relaxed" style={{background:'#FFFFFF',border:'1px solid #E5E7EB',boxShadow:'0 1px 3px rgba(10,22,40,0.05)',color:'#1F2937'}}>
            {[
              ['Who We Are', `Apex Getaways & Travel LTD ("Apex Getaways", "we", "us", "our") is a travel and immigration services company based in Abuja, Nigeria. Contact: ${BRAND.email} · ${BRAND.phone}`],
              ['Information We Collect', 'We collect information you provide when you contact us, request a quote, make a booking, or subscribe to our newsletter. This includes: full name, email address, phone number, passport details (for booking purposes), travel preferences, and payment information.'],
              ['How We Use Your Information', 'Your information is used to: process and manage your bookings, communicate about your travel arrangements, provide visa and immigration guidance, send promotional offers (with your consent), and improve our services.'],
              ['Data Sharing', 'We share your information only with trusted third parties necessary to fulfil your booking — airlines, hotels, visa processing centres, and transfer operators. We do not sell your personal data to any third party for marketing purposes.'],
              ['Data Security', 'We implement industry-standard security measures to protect your personal information. All payment transactions are processed through secure channels. Access to personal data is restricted to authorised staff only.'],
              ['Your Rights', 'You have the right to: access the personal data we hold about you, request correction of inaccurate data, request deletion of your data (subject to legal obligations), and withdraw consent for marketing communications at any time.'],
              ['Contact', `For any privacy-related concerns, contact us at: ${BRAND.email} or ${BRAND.phone}`],
            ].map(([title, text])=>(
              <div key={title}><h2 className="font-display font-bold text-primary text-lg mb-2">{title}</h2><p>{text}</p></div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
