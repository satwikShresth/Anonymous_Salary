import app from './src/main.ts';

const port = Deno.env.get('PORT');
const env = Deno.env.get('ENV');

try {
   Deno.serve({
      port,
   }, app.fetch);
   console.info(`🚀 Server running on http://localhost:${port}`);
   console.info(`✨ Environment: ${env}`);
} catch (error) {
   console.log(`Error: ${error}`);
   Deno.exit(1);
}
