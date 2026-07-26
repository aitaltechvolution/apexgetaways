import { useParams, Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import { Breadcrumb } from '../../components/ui'
import { ArrowLeft } from 'lucide-react'

export default function BlogPostPage() {
  const { slug } = useParams()
  return (
    <>
      <SEO title="Blog Post" />
      <section className="pt-28 pb-8 bg-surface-light dark:bg-surface-dark">
        <div className="container-pad max-w-3xl mx-auto">
          <Breadcrumb items={[{to:'/',label:'Home'},{to:'/blog',label:'Blog'},{label:'Article'}]} />
          <div className="mt-8 bg-white dark:bg-card-dark rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-card">
            <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">Travel Tips</span>
            <h1 className="font-bold text-3xl text-gray-900 dark:text-white mt-4 mb-4">Blog Article</h1>
            <p className="text-gray-600 text-base mb-8">Posted by Apex Getaways · 5 min read</p>
            <p className="text-gray-600 dark:text-gray-600 leading-relaxed">Full article content for "{slug}" would appear here. This is a placeholder for your blog post content system.</p>
            <Link to="/blog" className="inline-flex items-center gap-2 mt-8 text-base font-bold text-primary"><ArrowLeft size={14} />Back to Blog</Link>
          </div>
        </div>
      </section>
    </>
  )
}
