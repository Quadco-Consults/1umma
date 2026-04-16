import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type {
  StudentStatus,
  FeeStatus,
  PaymentStatus,
} from '@/lib/types';

type BadgeStatus = StudentStatus | FeeStatus | PaymentStatus;

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

const statusConfig: Record<
  BadgeStatus,
  { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }
> = {
  // Student statuses
  Active: {
    variant: 'default',
    className: 'bg-green-500 hover:bg-green-600 text-white',
  },
  Graduated: {
    variant: 'default',
    className: 'bg-blue-500 hover:bg-blue-600 text-white',
  },
  Exited: {
    variant: 'secondary',
    className: 'bg-gray-500 hover:bg-gray-600 text-white',
  },

  // Fee statuses
  Paid: {
    variant: 'default',
    className: 'bg-green-500 hover:bg-green-600 text-white',
  },
  Pending: {
    variant: 'default',
    className: 'bg-warning hover:bg-warning/90 text-white',
  },
  Overdue: {
    variant: 'destructive',
    className: 'bg-danger hover:bg-danger/90 text-white',
  },

  // Payment statuses
  Approved: {
    variant: 'default',
    className: 'bg-blue-500 hover:bg-blue-600 text-white',
  },
  Rejected: {
    variant: 'destructive',
    className: 'bg-danger hover:bg-danger/90 text-white',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {status}
    </Badge>
  );
}
