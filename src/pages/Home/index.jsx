import SEO from '../../components/SEO'
import HeroSection from '../../components/sections/HeroSection'
import MarqueeBanner from '../../components/sections/MarqueeBanner'
import PopularDestinations from '../../components/sections/PopularDestinations'
import PackagesSection from '../../components/sections/PackagesSection'
import ServicesSection from '../../components/sections/ServicesSection'
import StatsSection from '../../components/sections/StatsSection'
import WhyChooseUs from '../../components/sections/WhyChooseUs'
import Testimonials from '../../components/sections/Testimonials'
import CTASection from '../../components/sections/CTASection'
import NewsletterSection from '../../components/sections/NewsletterSection'
import { BRAND } from '../../data'

export default function HomePage() {
  return (
    <>
      <SEO
        title={`${BRAND.name} | ${BRAND.tagline}`}
        description="Apex Getaways & Travel LTD — trusted travel and immigration services in Nigeria. Flights, visa, hotels, study abroad, tour packages and more. Based in Abuja."
      />
      <HeroSection />
      {/* <MarqueeBanner /> */}
      <PopularDestinations />
      <PackagesSection />
      <StatsSection />
      <ServicesSection />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
      <NewsletterSection />
    </>
  )
}
