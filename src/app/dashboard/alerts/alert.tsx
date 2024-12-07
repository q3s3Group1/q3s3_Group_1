
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

// Interface for alert
interface AlertProps {
    title: string;
    description: string;
    status: 'Actief' | 'Inactief' | 'Stilstand';
}

// from status to variant
const statusToVariant: { [key in AlertProps['status']]: 'default' | 'destructive' } = {
  'Actief': 'default',
  'Inactief': 'destructive',
  'Stilstand': 'destructive',
}

export function AlertCard({ title, description, status }: AlertProps) {
  return (
    <Alert variant={statusToVariant[status] || 'default'}>
      <AlertTitle>
        {title}
      </AlertTitle>
      <AlertDescription>
        {description}
      </AlertDescription>
    </Alert>
  )
}
