import { defineMiddleware } from "astro:middleware";
import { SESSION_COOKIE, verifySession } from "./lib/server/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  // Prerendered routes are always public and render at build time, where
  // there is no request cookie to read (touching it triggers an Astro warn).
  if (context.isPrerendered) return next();

  const { pathname } = context.url;

  const token = context.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;
  context.locals.user = session;

  const isAdminApi = pathname.startsWith("/api/admin");
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (isAdminApi && !session) {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (isAdminPage && !session) {
    return context.redirect(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }

  if (pathname === "/admin/login" && session) {
    return context.redirect("/admin");
  }

  return next();
});
