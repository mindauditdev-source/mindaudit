# Variables de Entorno - MindAudit Spain

Este documento describe todas las variables de entorno necesarias para el proyecto.

## 📋 Configuración

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

## Database

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mindaudit"
```

## NextAuth

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
```

## Email Configuration

### Hostinger SMTP

```env
EMAIL_SERVER_HOST="smtp.hostinger.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="info@mindaudit.es"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="info@mindaudit.es"
```

### Resend (para emails transaccionales)

```env
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## File Storage

```env
# Options: 's3', 'cloudinary', 'vercel-blob'
STORAGE_PROVIDER="s3"

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="eu-west-1"
AWS_BUCKET_NAME="mindaudit-files"

# Cloudinary (alternativa)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Vercel Blob (alternativa)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxx"
```

## Integrations

```env
# Calendly
CALENDLY_API_KEY="your-calendly-api-key"
CALENDLY_WEBHOOK_SECRET="your-calendly-webhook-secret"

# TrustPilot
TRUSTPILOT_API_KEY="your-trustpilot-api-key"
TRUSTPILOT_BUSINESS_UNIT_ID="your-business-unit-id"
```

## Analytics & Monitoring

```env
# Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Sentry (error tracking)
SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"
```

## Feature Flags

```env
NEXT_PUBLIC_ENABLE_MAGIC_LINK="true"
NEXT_PUBLIC_ENABLE_CALENDLY="true"
NEXT_PUBLIC_ENABLE_TRUSTPILOT="true"
```

## Rate Limiting

```env
RATE_LIMIT_WINDOW_MS="900000"  # 15 minutes
RATE_LIMIT_MAX_REQUESTS="100"
```

## Development

```env
NODE_ENV="development"
DEBUG="false"
```
