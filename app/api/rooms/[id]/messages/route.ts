import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerContract } from "@/lib/server-chain";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const roomId = params.id;
  const address = req.nextUrl.searchParams.get("address"); // 1. Get address from query

  if (!address) {
    return NextResponse.json({ error: "address is required" }, { status: 400 });
  }

  // 2. ✅ ADDED SECURITY CHECK
  const contract = getServerContract();
  const isMember = await contract.isMember(roomId, address);

  if (!isMember) {
    console.log("⛔ FORBIDDEN — NOT A MEMBER:", address);
    return NextResponse.json(
      { error: "Forbidden: not a room member" },
      { status: 403 }
    );
  }

  // 3. Only return data if check passes
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  return NextResponse.json({ messages: data });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const roomId = params.id;
  const { sender, text, encrypted, ciphertext, iv, type, lang } = await req.json();

  // ✅ Validate sender
  if (!sender || (!text && !ciphertext)) {
    return NextResponse.json(
      { error: "sender and text/ciphertext required" },
      { status: 400 }
    );
  }

  // ✅ Blockchain access check
  const contract = getServerContract();
  const isMember = await contract.isMember(roomId, sender);

  if (!isMember) {
    console.log("⛔ FORBIDDEN — NOT A MEMBER:", sender);
    return NextResponse.json(
      { error: "Forbidden: not a room member" },
      { status: 403 }
    );
  }

  // ✅ Prepare insert data (handle both encrypted & normal messages)
  const messagePayload: any = {
    room_id: roomId,
    sender,
    created_at: new Date().toISOString(),
  };

  if (encrypted) {
    messagePayload.encrypted = true;
    messagePayload.ciphertext = ciphertext;
    messagePayload.iv = iv;
    messagePayload.text = null;
  } else {
    messagePayload.encrypted = false;
    messagePayload.text = text;
  }
  messagePayload.type = type || 'text'; // Default to 'text' if not provided
  if (lang) {
    messagePayload.lang = lang;
  }

  // ✅ Insert into Supabase
  const { data, error } = await supabase
    .from("messages")
    .insert([messagePayload])
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

