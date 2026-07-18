export const copyToClipboard = (t) => navigator.clipboard.writeText(t)
export const shareContent = async ({ title, text, url }) => {
  if (navigator.share) { await navigator.share({ title, text, url }) }
  else { await copyToClipboard(url) }
}
export const waShareLink = (text, url) => `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
