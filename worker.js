/**
 * Cloudflare Worker to handle Trustline contact form submissions.
 * Updated to include full CORS support and Absolute Redirects for cross-domain success pages.
 * 
 * Deployment Instructions:
 * 1. Create a new Worker in the Cloudflare Dashboard.
 * 2. Paste this code into the editor.
 * 3. Add an environment variable (Secret) named `EMAIL_API_KEY` (using a service like Resend).
 * 4. Add an environment variable named `EMAIL_FROM` (e.g., "contact@trustlinetechnologies.com").
 * 5. Assign the worker to the route: trustlinetechnologies.com/api/contact
 */

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS pre-flight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Only allow POST requests for the actual form submission
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    try {
      const formData = await request.formData();
      
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        entity: formData.get('entity'),
        replace: formData.get('replace'),
        tier: formData.get('tier'),
        timeline: formData.get('timeline'),
        message: formData.get('message'),
      };

      // Basic validation
      if (!data.name || !data.email || !data.message) {
        return new Response('Missing required fields', { 
          status: 400, 
          headers: corsHeaders 
        });
      }

      // Construct the email body
      const emailBody = `
New Trustline Project Inquiry:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Entity: ${data.entity}
Replacing/Consolidating: ${data.replace}
Interested Tier: ${data.tier}
Timeline: ${data.timeline}

Message:
${data.message}
      `.trim();

      // Send email via Resend API
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.EMAIL_API_KEY}`,
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM || 'onboarding@resend.dev',
          to: ['ryan@trustlinetechnologies.com'],
          subject: `Trustline Inquiry: ${data.name} (${data.entity})`,
          text: emailBody,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Email API error:', errorText);
        throw new Error('Failed to send email');
      }

      // HANDLE REDIRECT
      // We use the Referer header to send the user back to the site they came from
      const referer = request.headers.get('Referer');
      let redirectUrl = 'https://trustlinetechnologies.com/contact.html?status=success';
      
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          // Redirect back to the original page but append the success flag
          redirectUrl = refererUrl.origin + refererUrl.pathname + '?status=success';
        } catch (e) {
          console.error('Referer parsing failed, using default redirect');
        }
      }

      return new Response(null, {
        status: 303,
        headers: {
          ...corsHeaders,
          'Location': redirectUrl,
        },
      });

    } catch (err) {
      console.error('Worker error:', err);
      return new Response('An error occurred while processing your request. Please try again later.', { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'text/plain' 
        }
      });
    }
  },
};
