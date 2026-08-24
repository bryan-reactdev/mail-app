import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useUserStore } from '@/stores/useUserStore'
import { roleLabel } from '@/lib/auth'

export default function Profile() {
  const currentUser = useUserStore((s) => s.currentUser)

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>
          {currentUser?.firstName} {currentUser?.lastName}
        </CardTitle>
        <CardDescription>{roleLabel(currentUser?.role)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground text-[0.8125rem]">Email</p>
          <p className="font-medium">{currentUser?.email}</p>
        </div>
        {currentUser?.phone ? (
          <div>
            <p className="text-muted-foreground text-[0.8125rem]">Teléfono</p>
            <p className="font-medium">{currentUser.phone}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
