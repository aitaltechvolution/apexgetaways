export function Skeleton({ className='' }) {
  return <div className={`animate-shimmer rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%] ${className}`} />
}
