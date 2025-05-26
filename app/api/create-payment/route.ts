import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();
    const payment_intent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: payment_intent.client_secret });
  } catch (error) {
    console.log("Internal error: " + error);

    return NextResponse.json(
      { error: "Internal server error: " + error },
      { status: 500 }
    );
  }
}
