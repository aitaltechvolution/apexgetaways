import { Link } from 'react-router-dom'
import SEO from '../../components/SEO'
export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" />
      <section className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark px-6 pt-20">
        <div className="text-center">
          <p className="text-8xl font-extrabold text-primary/20 mb-4">404</p>
          <h1 className="font-bold text-3xl text-gray-900 dark:text-white mb-4">Page Not Found</h1>
          <p className="text-gray-600 dark:text-gray-600 mb-8 max-w-sm mx-auto">The page you are looking for does not exist or has been moved.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/" className="px-7 py-3 rounded-xl font-bold text-base text-white bg-primary-gradient shadow-glow">Go Home</Link>
            <Link to="/destinations" className="px-7 py-3 rounded-xl font-bold text-base border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">Browse Destinations</Link>
          </div>
        </div>
      </section>
    </>
  )
}
