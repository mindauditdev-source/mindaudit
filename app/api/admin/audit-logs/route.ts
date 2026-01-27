import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/middleware/api-auth";
import { requireAdmin } from "@/middleware/api-rbac";
import { successResponse, serverErrorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/db/prisma";
import { AuditAction } from "@prisma/client";

/**
 * GET /api/admin/audit-logs
 * List all system audit logs (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    requireAdmin(user);

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") as AuditAction | null;
    const entity = searchParams.get("entity");
    const userId = searchParams.get("userId");
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where: import('@prisma/client').Prisma.AuditLogWhereInput = {};
    if (action) where.action = action;
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skip,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return successResponse({
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Error GET /api/admin/audit-logs:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return serverErrorResponse(message);
  }
}
