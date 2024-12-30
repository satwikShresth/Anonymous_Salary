export const prerender = true;

export const load = async ({ fetch }) => {
  const validValues = await fetch("/api/v1/options/radio");
  const validValuesData = await validValues.json();

  return { validValues: validValuesData };
};
