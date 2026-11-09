// Cloudflare Worker behind https://formularz.hydrokotly.pl: the contact form on the site posts here,
// and the submission goes by e-mail to the address set in the send_email binding (wrangler.jsonc).
import { EmailMessage } from "cloudflare:email";
import { handle } from "./handler.js";

export default {
  async fetch(request, env) {
    return handle(request, {
      allowedOrigins: env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()),
      from: env.FROM_ADDRESS,
      to: env.TO_ADDRESS,
      send: (raw) => env.MAIL.send(new EmailMessage(env.FROM_ADDRESS, env.TO_ADDRESS, raw)),
    });
  },
};
