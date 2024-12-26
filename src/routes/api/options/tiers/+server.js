import { json } from '@sveltejs/kit';

export async function GET() {
  const tiers = [
    { value: 'free', label: 'Free Tier' },
    { value: 'basic', label: 'Basic ($9.99/mo)' },
    { value: 'pro', label: 'Pro ($19.99/mo)' }
  ];

  return json(tiers);
}
