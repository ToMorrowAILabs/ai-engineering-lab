import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Auth stub — pass-through until AUTH_ENABLED=true */
export function middleware(_request: NextRequest) {
  // Future: if (process.env.AUTH_ENABLED === 'true' && !session) redirect('/login')
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
