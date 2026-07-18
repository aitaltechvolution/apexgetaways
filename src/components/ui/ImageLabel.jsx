export function ImageLabel({ children, position='bottom-left' }) {
  const pos = { 'top-left':'top-3 left-3', 'top-right':'top-3 right-3', 'bottom-left':'bottom-3 left-3', 'bottom-right':'bottom-3 right-3' }
  return <span className={`img-label absolute ${pos[position]}`}>{children}</span>
}
