import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';

export async function POST(req: NextRequest) {
  try {
    const { message, signature } = await req.json();

    // 1. Create a new SiweMessage instance
    const siweMessage = new SiweMessage(message);

    // 2. Verify the signature
    const { data } = await siweMessage.verify({ signature });

    // 3. Check if the address in the message matches the one that signed
    if (data.address !== siweMessage.address) {
      return NextResponse.json({ ok: false, error: 'Signature does not match address' }, { status: 401 });
    }

    // At this point, the user is authenticated
    // In a real app, you would create a session/JWT here
    
    return NextResponse.json({ ok: true, address: data.address });

  } catch (error) {
    console.error('Verification failed:', error);
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}