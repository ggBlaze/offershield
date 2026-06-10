import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * Root `/` route. The middleware already issues a 307 to the user's
 * preferred locale before reaching this point, so reaching here is
 * rare — but if it does happen (e.g. middleware was bypassed during
 * a build or in an unusual request), fall through to the default
 * locale rather than 404.
 */
export default function RootRedirect() {
  redirect(`/${DEFAULT_LOCALE}`);
}
