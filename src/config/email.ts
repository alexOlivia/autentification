import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { env } from './env.js';

let transporter: Transporter | null = null;

export function getEmailTransporter(): Transporter {
  if (transporter) return transporter;

  if (env.NODE_ENV === 'development') {
    // En développement, utiliser un transporteur qui log dans la console
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST || 'localhost',
      port: env.SMTP_PORT,
      secure: false,
      ignoreTLS: true,
    });
  } else {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  return transporter;
}

export const emailConfig = {
  from: env.SMTP_FROM || `Auth Service <noreply@${env.SMTP_HOST || 'localhost'}>`,
} as const;
