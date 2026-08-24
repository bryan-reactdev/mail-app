import { useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
            <AlertCircle className="size-6 text-muted-foreground" />
          </div>
          <CardTitle>Página no encontrada</CardTitle>
          <CardDescription>
            La página que buscas no existe o se ha movido.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Button variant="default" onClick={() => navigate(-1)} className="flex-1">
            <ArrowLeft className="mr-2 size-4" />
            Volver
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex-1"
          >
            <Home className="mr-2 size-4" />
            Inicio
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
