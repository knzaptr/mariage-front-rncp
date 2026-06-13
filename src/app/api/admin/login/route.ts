import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { jsonValidationError } from "@/lib/api/zod-response";
import { adminCredentialsSchema } from "@/schemas/api";
import SHA256 from "crypto-js/sha256";
import encBase64 from "crypto-js/enc-base64";

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

    if (!adminLogin) {
      return NextResponse.json(
        { message: "Admin not found 🤔" },
        { status: 404 }
      );
    }

    const hashToCompare = SHA256(password + adminLogin.salt).toString(
      encBase64
    );

    if (hashToCompare !== adminLogin.hash) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 409 }
      );
    }

    return NextResponse.json({ token: adminLogin.token }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
