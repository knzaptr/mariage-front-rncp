/**
 * URL d’API relative à l’origine courante (même schéma, hôte et port que la page).
 * Évite les erreurs « Failed to fetch » liées à localhost vs 127.0.0.1 ou à une mauvaise BASE_URL.
 *
 * @param path Chemin sous `/api/`, sans slash initial ni préfixe `api/`
 * @example apiPath("guests") → "/api/guests"
 * @example apiPath("programme?id=1") → "/api/programme?id=1"
 */
export function apiPath(path: string): string {
  const clean = path.replace(/^\/+/, "").replace(/^api\/?/i, "");
  return `/api/${clean}`;
}
