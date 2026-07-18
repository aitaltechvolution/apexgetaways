import { Helmet } from 'react-helmet-async'
import { BRAND } from '../data'

export default function SEO({ title, description, image }) {
  const fullTitle = title && title !== BRAND.name
    ? `${title} | ${BRAND.shortName}`
    : BRAND.name
  const desc = description || `${BRAND.name} — ${BRAND.tagline} Flights, visa, hotels, study abroad, immigration and tour packages from Abuja, Nigeria.`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="author" content={BRAND.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}
