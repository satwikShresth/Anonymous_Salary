import { Hono } from '@hono/hono';
import { logger } from '@hono/hono/logger';
import { cors } from '@hono/hono/cors';

// Create the main app instance
const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Basic health check endpoint
app.get('/health', (c) => {
   return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
   });
});

// Sample GET endpoint
app.get('/api/hello/:name', (c) => {
   const name = c.req.param('name');
   return c.json({
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString(),
   });
});

// Sample POST endpoint
app.post('/api/message', async (c) => {
   const body = await c.req.json();

   if (!body.message) {
      return c.json({ error: 'Message is required' }, 400);
   }

   return c.json({
      received: body.message,
      timestamp: new Date().toISOString(),
   });
});

// Error handling
app.onError((err, c) => {
   console.error(`${err}`);
   return c.json({
      error: 'Internal Server Error',
      message: err.message,
   }, 500);
});

// Not Found handler
app.notFound((c) => {
   return c.json({
      error: 'Not Found',
      message: 'The requested resource was not found',
   }, 404);
});

// Start the server
const port = Deno.env.get('PORT') || 3000;
console.log(`Server is running on port ${port}`);

export default app;
