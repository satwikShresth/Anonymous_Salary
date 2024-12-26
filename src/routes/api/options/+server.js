import { json } from '@sveltejs/kit';

export async function GET() {
  const data = {
    countries: [
      'United States',
      'Canada',
      'United Kingdom',
      'Germany',
      'France',
      'Japan',
      'Australia',
      'Brazil',
      'India',
      'China'
    ],
    interests: [
      'Technology',
      'Sports',
      'Music',
      'Art',
      'Science',
      'Travel',
      'Food',
      'Fashion',
      'Business',
      'Health'
    ],
    subscriptionOptions: [
		{ value: 'free', label: 'Free Tier' },
		{ value: 'basic', label: 'Basic ($9.99/mo)' },
		{ value: 'pro', label: 'Pro ($19.99/mo)' }
	]  
   };

  return json(data);
}
