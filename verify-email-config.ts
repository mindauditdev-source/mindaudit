
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

// 1. Manually read .env to avoid 'dotenv' dependency issues
const envPath = path.join(process.cwd(), '.env');
let key = '';
let from = '';

try {
  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split('\n');
  
  lines.forEach(line => {
    if (line.startsWith('RESEND_API_KEY=')) {
      key = line.split('=')[1].trim();
    }
    if (line.startsWith('EMAIL_FROM=')) {
      // Remove quotes if present
      const raw = line.split('=')[1].trim();
      from = raw.replace(/^"|"$/g, '');
    }
  });
} catch (e) {
  console.error('Failed to read .env:', e);
  process.exit(1);
}

if (!key) {
  console.error('RESEND_API_KEY not found in .env');
  process.exit(1);
}

// 2. Initialize Resend
const resend = new Resend(key);

console.log('--- Email Config Test ---');
console.log('Sending From:', from);
console.log('Using Key:', key.slice(0, 5) + '...' + key.slice(-5));

// 3. Send Test Email
(async () => {
  try {
    const { data, error } = await resend.emails.send({
      from: from,
      to: 'jjhurtado017@gmail.com',
      subject: 'Verification Test',
      html: '<p>If you see this, your config is valid!</p>'
    });

    if (error) {
      console.error('❌ FAILED:', error);
    } else {
      console.log('✅ SUCCESS! Email sent. ID:', data?.id);
      console.log('This confirms your API Key and .env file are CORRECT.');
      console.log('If your app fails, restart the dev server completely!');
    }
  } catch (err) {
    console.error('❌ EXCEPTION:', err);
  }
})();
