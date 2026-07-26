import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionTitle } from '../ui'

const TIPS = [
  { title:'10 Things to Know Before Visiting Dubai', cat:'Travel Tips', img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80', min:5 },
  { title:'How to Apply for a Schengen Visa from Nigeria', cat:'Visa Guide', img:'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=400&q=80', min:7 },
  { title:'Best Time to Visit the Maldives on a Budget', cat:'Budget Travel', img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80', min:4 },
]

export default function TravelTips() {
  return (
    <section className="section-pad bg-white dark:bg-navy/50">
      <div className="container-pad">
        <div className="flex items-end justify-between mb-12">
          <SectionTitle label="From Our Blog" title="Travel Tips & Guides" center={false} />
          <Link to="/blog" className="hidden sm:flex items-center gap-1.5 text-base font-bold text-primary hover:gap-2.5 transition-all">All Articles <ArrowRight size={14} /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TIPS.map((t,i) => (
            <Link key={i} to="/blog" className="group bg-white dark:bg-card-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 block">
              <div className="overflow-hidden h-44">
                <img src={t.img} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">{t.cat}</span>
                  <span className="text-sm text-gray-600">{t.min} min read</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug group-hover:text-primary transition-colors">{t.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
