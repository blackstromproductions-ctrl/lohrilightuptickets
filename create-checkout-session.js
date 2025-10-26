// api/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tickets } = req.body;

    if (!tickets || tickets.length === 0) {
      return res.status(400).json({ error: "No tickets provided" });
    }

    const line_items = tickets.map((ticket) => ({
      price_data: {
        currency: "eur",
        product_data: { name: ticket.name },
        unit_amount: Math.round(ticket.price * 100),
      },
      quantity: ticket.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "https://yourdomain.com/success.html",
      cancel_url: "https://yourdomain.com/cancel.html",
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}