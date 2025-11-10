import { NextRequest, NextResponse } from "next/server";
import { SiweMessage } from "siwe";

export async function POST(req: NextRequest) {
  try {
    const { message, signature } = await req.json();

    // message must be the full SIWE object (not prepared string)
    const siwe = new SiweMessage(message);

    await siwe.verify({
      signature,
      domain: siwe.domain,
      nonce: siwe.nonce,
    });

    return NextResponse.json({ ok: true, address: siwe.address });
  } catch (err: any) {
    console.error("SIWE VERIFY ERROR:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
