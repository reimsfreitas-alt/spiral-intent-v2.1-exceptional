import {NextResponse} from 'next/server';
export async function GET(){return NextResponse.json({service:'spiral-intent',protocol:'ievp/v1',stripeConfigured:!!process.env.STRIPE_SECRET_KEY&&!!process.env.STRIPE_READ_ONLY_KEY,cryptoConfigured:!!process.env.ED25519_PRIVATE_KEY_HEX&&!!process.env.ED25519_PUBLIC_KEY_HEX});}
