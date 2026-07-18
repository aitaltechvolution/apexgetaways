import { Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import { PageHero } from '../../components/ui/PageHero'

const POSTS = [
  { slug:'dubai-tips', title:'10 Things to Know Before Visiting Dubai', cat:'Travel Tips', date:'Jun 10, 2025', img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', min:5, excerpt:'Dubai is a dazzling city of contrasts — ultramodern skyscrapers alongside ancient souks. Here is everything first-time visitors need to know.' },
  { slug:'schengen-visa-nigeria', title:'How to Apply for a Schengen Visa from Nigeria', cat:'Visa Guide', date:'May 28, 2025', img:'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=600&q=80', min:7, excerpt:'A step-by-step guide to getting your Schengen visa approved — documents, embassy appointments, fees, and expert tips.' },
  { slug:'maldives-budget', title:'Best Time to Visit the Maldives on a Budget', cat:'Budget Travel', date:'May 14, 2025', img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', min:4, excerpt:'The Maldives does not have to break the bank. Here is how to experience paradise without overspending.' },
  { slug:'london-guide', title:'London Travel Guide for Nigerians (2025 Edition)', cat:'Destination Guide', date:'Apr 30, 2025', img:'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=600&q=80', min:8, excerpt:'From Heathrow arrivals to the best halal restaurants in East London — everything Nigerian travellers need to know.' },
  { slug:'travel-insurance', title:'Why Travel Insurance is Non-Negotiable in 2025', cat:'Travel Tips', date:'Apr 12, 2025', img:'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80', min:5, excerpt:'Lost luggage, missed flights, medical emergencies abroad — we break down why travel insurance is essential for every trip.' },
  { slug:'istanbul-guide', title:'Istanbul in 5 Days: The Ultimate Itinerary', cat:'Destination Guide', date:'Mar 25, 2025', img:'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80', min:6, excerpt:'From the Blue Mosque at dawn to a sunset cruise on the Bosphorus — the perfect 5-day Istanbul itinerary.' },
]

export default function BlogPage() {
  const [featured, ...rest] = POSTS
  return (
    <>
      <SEO title="Travel Blog" description="Tips, guides, and inspiration for Nigerian travellers — from the Apex Getaways team." />
      <PageHero label="Our Blog" title="Travel Tips & Inspiration" subtitle="Expert guides, destination spotlights, visa advice and travel hacks from our team." />
      <section className="section-pad bg-surface-light dark:bg-surface-dark">
        <div className="container-pad">
          {/* Featured */}
          <Link to={`/blog/${featured.slug}`} className="group block bg-white dark:bg-card-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 mb-8 grid md:grid-cols-2">
            <div className="overflow-hidden h-64 md:h-auto"><img src={featured.img} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
            <div className="p-8 flex flex-col justify-center">
              <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg mb-3">{featured.cat}</span>
              <h2 className="font-bold text-2xl text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">{featured.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400"><span>{featured.date}</span><span>·</span><span>{featured.min} min read</span></div>
            </div>
          </Link>
          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group bg-white dark:bg-card-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                <div className="overflow-hidden h-44"><img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2"><span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">{post.cat}</span><span className="text-xs text-gray-400">{post.min} min</span></div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-xs text-gray-400 mt-2">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
