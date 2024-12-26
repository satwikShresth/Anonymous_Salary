import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  const query = url.searchParams.get('q') || '';
  
  const countries = [
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
  ];

  const filteredCountries = countries.filter(country => 
    country.toLowerCase().includes(query.toLowerCase())
  );

  return json(filteredCountries);
}
