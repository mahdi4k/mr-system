import authMiddleware, { type NextRequestWithAuth } from "next-auth/middleware";

export default function proxy(request: NextRequestWithAuth) {
  return authMiddleware(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
