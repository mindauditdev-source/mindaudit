'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/validators/auth.validator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Loader2,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  MapPin,
  Globe,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const acceptTerms = watch('acceptTerms')

  const onSubmit = async (data: RegisterInput) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Error al registrar. Por favor, intenta de nuevo.')
        return
      }

      setSuccess(true)
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login?registered=true')
      }, 2000)
    } catch (err) {
      console.error('Error en registro:', err)
      setError('Ocurrió un error. Por favor, intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-2xl space-y-6">
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ¡Registro exitoso! Te hemos enviado un email de verificación.
            Redirigiendo al login...
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Registro de Partner</h1>
        <p className="text-muted-foreground">
          Completa el formulario para crear tu cuenta
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Personal */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Información Personal</h2>
          
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Juan Pérez"
                className="pl-10"
                {...register('name')}
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="pl-10"
                {...register('email')}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Contraseñas */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...register('password')}
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...register('confirmPassword')}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Información de la Empresa */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Información de la Empresa</h2>

          {/* Nombre de la Empresa y CIF */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nombre de la Empresa *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="companyName"
                  placeholder="Mi Empresa SL"
                  className="pl-10"
                  {...register('companyName')}
                  disabled={isLoading}
                />
              </div>
              {errors.companyName && (
                <p className="text-sm text-destructive">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cif">CIF *</Label>
              <Input
                id="cif"
                placeholder="A12345678"
                {...register('cif')}
                disabled={isLoading}
              />
              {errors.cif && (
                <p className="text-sm text-destructive">{errors.cif.message}</p>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+34 612 345 678"
                className="pl-10"
                {...register('phone')}
                disabled={isLoading}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address">Dirección (opcional)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="Calle Principal 123"
                className="pl-10"
                {...register('address')}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Ciudad, Provincia, Código Postal */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad (opcional)</Label>
              <Input
                id="city"
                placeholder="Madrid"
                {...register('city')}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Provincia (opcional)</Label>
              <Input
                id="province"
                placeholder="Madrid"
                {...register('province')}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">C.P. (opcional)</Label>
              <Input
                id="postalCode"
                placeholder="28001"
                {...register('postalCode')}
                disabled={isLoading}
              />
              {errors.postalCode && (
                <p className="text-sm text-destructive">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Sitio Web (opcional)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                type="url"
                placeholder="https://www.miempresa.com"
                className="pl-10"
                {...register('website')}
                disabled={isLoading}
              />
            </div>
            {errors.website && (
              <p className="text-sm text-destructive">
                {errors.website.message}
              </p>
            )}
          </div>
        </div>

        {/* Términos y Condiciones */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            {...register('acceptTerms')}
            disabled={isLoading}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="acceptTerms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Acepto los términos y condiciones *
            </label>
            <p className="text-sm text-muted-foreground">
              He leído y acepto los{' '}
              <Link href="/legal/terminos" className="text-primary hover:underline">
                términos de servicio
              </Link>{' '}
              y la{' '}
              <Link href="/legal/privacidad" className="text-primary hover:underline">
                política de privacidad
              </Link>
              .
            </p>
          </div>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-destructive">
            {errors.acceptTerms.message}
          </p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !acceptTerms}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </Button>
      </form>

      {/* Login Link */}
      <div className="text-center text-sm">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  )
}
