import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router-dom'
import { AlertCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Error() {
  const error = useRouteError()
  const navigate = useNavigate()

  let title = 'Algo salió mal'
  let message = 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Página no encontrada'
      message = 'La página que buscas no existe o se ha movido.'
    } else if (error.status === 403) {
      title = 'Acceso denegado'
      message = 'No tienes permiso para ver esta página.'
    } else if (error.status === 500) {
      title = 'Error del servidor'
      message = 'Algo falló en el servidor. Intenta más tarde.'
    } else {
      title = `Error ${error.status}`
      message = error.statusText || message
    }
  } else if (error instanceof globalThis.Error) {
    message = error.message
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String((error as { message: unknown }).message)
  }

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            variant="default"
            onClick={() => navigate(-1)}
            className="flex-1 sm:min-w-0"
          >
            <ArrowLeft className="mr-2 size-4" />
            Volver
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex-1 sm:min-w-0"
          >
            <Home className="mr-2 size-4" />
            Inicio
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.location.reload()}
            className="flex-1 sm:min-w-0"
          >
            <RefreshCw className="mr-2 size-4" />
            Recargar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
