import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getServerContract } from "@/lib/server-chain";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { wallet } = await req.json();
    if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 });

    const contract = getServerContract();

    // only mirror after on-chain state reflects it
    const isMember: boolean = await contract.isMember(id, wallet);
    if (!isMember) {
      return NextResponse.json({ error: "wallet is not a member on-chain" }, { status: 400 });
    }

    const room = store.addMember(id, wallet);
    return NextResponse.json({ room });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
