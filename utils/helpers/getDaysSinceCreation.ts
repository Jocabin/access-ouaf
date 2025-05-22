export function getDaysSinceCreation(dateString: string): number {
    const createdAt = new Date(dateString)
    const now = new Date()
  
    const diffInMs = now.getTime() - createdAt.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
    return diffInDays
  }