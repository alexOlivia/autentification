import { env } from '../config/env.js';
import { getEmailTransporter, emailConfig } from '../config/email.js';

export async function sendSMS(telephone: string, message: string): Promise<void> {
  if (env.NODE_ENV === 'development') {
    console.log(`[SMS -> ${telephone}] ${message}`);
    return;
  }

  if (!env.SMS_PROVIDER_URL || !env.SMS_PROVIDER_API_KEY) {
    console.warn('SMS provider non configuré, message ignoré');
    return;
  }

  const response = await fetch(env.SMS_PROVIDER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.SMS_PROVIDER_API_KEY}`,
    },
    body: JSON.stringify({
      to: telephone,
      message,
      sender_id: env.SMS_SENDER_ID,
    }),
  });

  if (!response.ok) {
    console.error(`Erreur envoi SMS: ${response.status} ${response.statusText}`);
  }
}

export async function sendEmail(email: string, subject: string, body: string): Promise<void> {
  if (env.NODE_ENV === 'development') {
    console.log(`[EMAIL -> ${email}] ${subject}: ${body}`);
    return;
  }

  if (!env.SMTP_HOST) {
    console.warn('SMTP non configuré, email ignoré');
    return;
  }

  try {
    const transporter = getEmailTransporter();
    await transporter.sendMail({
      from: emailConfig.from,
      to: email,
      subject,
      text: body,
      html: `<p>${body.replace(/\n/g, '<br>')}</p>`,
    });
  } catch (error) {
    console.error('Erreur envoi email:', error);
  }
}

export async function sendVerificationCode(
  channel: 'SMS' | 'EMAIL',
  destination: string,
  code: string,
): Promise<void> {
  const message = `Votre code de vérification est : ${code}. Il expire dans quelques minutes.`;

  if (channel === 'SMS') {
    await sendSMS(destination, message);
  } else {
    await sendEmail(destination, 'Code de vérification', message);
  }
}

export async function sendNewSessionAlert(
  email: string | null | undefined,
  telephone: string,
  deviceInfo: { appareil: string; localisation: string },
): Promise<void> {
  const message = `Nouvelle connexion détectée sur votre compte depuis ${deviceInfo.appareil} (${deviceInfo.localisation}). Si ce n'est pas vous, changez votre mot de passe immédiatement.`;

  // Priorité SMS (contexte africain)
  await sendSMS(telephone, message);

  // Envoyer aussi par email si disponible
  if (email) {
    await sendEmail(email, 'Alerte de sécurité - Nouvelle connexion', message);
  }
}

export async function send2FACode(
  telephone: string,
  email: string | null | undefined,
  code: string,
): Promise<void> {
  const message = `Code de vérification 2FA : ${code}. Ce code expire dans 5 minutes.`;

  // Priorité SMS
  await sendSMS(telephone, message);

  // Aussi par email si disponible
  if (email) {
    await sendEmail(email, 'Code de double authentification', message);
  }
}
