import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Email Notification
  app.post('/api/notify', (req, res) => {
    const { name, email, ipAddress } = req.body;
    
    console.log('--- NEW WAITLIST SIGNUP ---');
    console.log(`To: visionbuddyind@gmail.com`);
    console.log(`User: ${name} (${email})`);
    console.log(`IP: ${ipAddress}`);
    console.log('---------------------------');
    
    // NOTE: To send a real email, you would use a service like Resend or SendGrid here.
    // Example with a generic fetch (hypothetical):
    /*
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'VisionBuddy <onboarding@resend.dev>',
        to: 'visionbuddyind@gmail.com',
        subject: 'New Waitlist Joiner!',
        html: `<p><strong>${name}</strong> (${email}) just joined the waitlist from ${ipAddress}!</p>`
      })
    });
    */

    res.json({ success: true, message: 'Notification logged' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
