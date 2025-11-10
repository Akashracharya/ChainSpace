import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerContract } from "@/lib/server-chain";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const roomId = params.id;

  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  return NextResponse.json({ messages: data });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const roomId = params.id;
  const { sender, text } = await req.json();

  if (!sender || !text)
    return NextResponse.json({ error: "sender and text required" }, { status: 400 });

  // ✅ Blockchain contract validation
  const contract = getServerContract();
  const isMember = await contract.isMember(roomId, sender);

  if (!isMember) {
    console.log("⛔ FORBIDDEN — NOT A MEMBER:", sender);
    return NextResponse.json({ error: "Forbidden: not a room member" }, { status: 403 });
  }

  // ✅ Store message if allowed
  const { data, error } = await supabase
  .from("messages")
  .insert([{ room_id: roomId, sender, text }])
  .select();

if (error) {
  console.error("❌ Supabase insert error:", error);
  return NextResponse.json({ error: error.message }, { status: 500 });
}

if (!data || data.length === 0) {
  console.error("❌ No message returned from Supabase insert");
  return NextResponse.json({ error: "Insert failed" }, { status: 500 });
}

console.log("✅ Message stored:", data[0]);

return NextResponse.json({ message: data[0] }, { status: 201 });
}
