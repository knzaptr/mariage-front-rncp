import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function jsonValidationError(error: ZodError) {
  return NextResponse.json(
    { error: "Données invalides", details: error.flatten() },
    { status: 400 },
  );
}
