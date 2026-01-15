import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { logRouting } from './services/logs';
import { auth } from './auth';

// export default createMiddleware(routing)

const intlMiddleware = createMiddleware({
  locales: routing.locales,
  localePrefix: routing.localePrefix,
  defaultLocale: routing.defaultLocale,
});

export default async function middleware(req) {
	const { pathname } = req.nextUrl;
	const search = req.nextUrl.search;
  const endpoint = pathname + search;
  const url = req.headers.get("x-forwarded-proto") + "://" + req.headers.get("host") + endpoint;

  const session = await auth();
  const user = session?.user;
  delete user?.image;
  const log = {
    user: session?.user,
    url,
  };
  logRouting(log);
  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};