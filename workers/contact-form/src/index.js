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
      // Two Rate Limiting bindings (wrangler.jsonc): one per visitor, one for the whole form,
      // so a script with many addresses still cannot send more than a few e-mails a minute.
      limit: async (visitor) => {
        const [perVisitor, total] = await Promise.all([
          env.LIMIT_VISITOR?.limit({ key: visitor }) ?? { success: true },
          env.LIMIT_TOTAL?.limit({ key: "form" }) ?? { success: true },
        ]);
        return perVisitor.success && total.success;
      },
    });
  },
};
