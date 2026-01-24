import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    const normalized = status.toUpperCase()
    
    switch (normalized) {
      case 'DELIVERED':
        return 'bg-success/10 text-success border-success/20'
      case 'PENDING':
      case 'IN_TRANSIT':
      case 'ON_DELIVERY':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'PAID':
        return 'bg-success/10 text-success border-success/20'
      case 'UNPAID':
        return 'bg-warning/10 text-warning border-warning/20'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
        getStatusStyles(status),
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  )
}
