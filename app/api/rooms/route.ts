import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerContract } from "@/lib/server-chain";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address)
    return NextResponse.json({ error: "address is required" }, { status: 400 });

  const { data } = await supabase
    .from("rooms")
    .select("*")
    .order("created_at", { ascending: true });

  return NextResponse.json({ rooms: data });
}

export async function POST(req: NextRequest) {
  try {
    const { id, name, owner } = await req.json();

    if (!id || !name || !owner)
      return NextResponse.json({ error: "id, name and owner required" }, { status: 400 });

    const contract = getServerContract();

    // ✅ On-chain check: room must exist on chain AND owner must match
    const exists = await contract.roomExists(id);
    const isOwner = await contract.isOwner(id, owner);

    if (!exists) return NextResponse.json({ error: "room not found on-chain" }, { status: 403 });
    if (!isOwner) return NextResponse.json({ error: "you are not the owner on-chain" }, { status: 403 });

    // ✅ Store in Supabase
    const { data, error } = await supabase
      .from("rooms")
      .insert([{ id, name, owner }])
      .select();

    if (error) throw error;

    return NextResponse.json({ room: data[0] }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
