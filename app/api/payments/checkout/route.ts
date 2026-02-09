import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";

import { 
  unauthorizedResponse, 
  forbiddenResponse,
  serverErrorResponse
} from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (user.role !== "EMPRESA") {
      return forbiddenResponse("Solo las empresas pueden realizar pagos");
    }



    return NextResponse.json({
      message: "Checkout session created",
      url: "",
    });

  } catch (error: unknown) {
    console.error("Stripe Session Error:", error);
    if (error instanceof Error) {
      if (error.name === 'AuthenticationError') return unauthorizedResponse(error.message);
    }
    return serverErrorResponse();
  }
}
