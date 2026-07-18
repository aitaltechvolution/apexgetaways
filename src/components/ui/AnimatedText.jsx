import { motion } from 'framer-motion'
export function AnimatedText({ text, className='' }) {
  return (
    <motion.span className={className} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
      {text}
    </motion.span>
  )
}
