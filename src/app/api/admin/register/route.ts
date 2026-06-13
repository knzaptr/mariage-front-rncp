import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { jsonValidationError } from "@/lib/api/zod-response";
import { adminCredentialsSchema } from "@/schemas/api";
import SHA256 from "crypto-js/sha256";
import encBase64 from "crypto-js/enc-base64";
import uid2 from "uid2";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = adminCredentialsSchema.safeParse(body);
    if (!parsed.success) {
      return jsonValidationError(parsed.error);
    }
    const { email, password } = parsed.data;

    const adminLogin = await prisma.admin.findUnique({
      where: { email },
    });

    if (adminLogin) {
      return NextResponse.json(
        { message: "Already resgistered" },
        { status: 404 }
      );
    }

    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(64);

    const newAdmin = await prisma.admin.create({
      data: {
        email,
        token,
        hash,
        salt,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { id: newAdmin.id, email: newAdmin.email },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
