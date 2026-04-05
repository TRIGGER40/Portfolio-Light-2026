import { PROJECT_LINKS } from '../data/aiContext';

/**
 * Replace canonical project name keywords in an HTML string with
 * <a data-nav="/path" class="ai-project-link"> tags.
 * Uses a global CSS class (not CSS modules) so it works in any component.
 */
export function injectProjectLinks(html: string): string {
  let result = html;
  for (const { pattern, route } of PROJECT_LINKS) {
    // Reset lastIndex for global regexes between calls
    pattern.lastIndex = 0;
    result = result.replace(
      pattern,
      (match) => `<a data-nav="${route}" class="ai-project-link">${match}</a>`
    );
  }
  return result;
}

/**
 * Attach a delegated click handler to a container element.
 * Returns a cleanup function to remove the listener.
 */
export function attachNavDelegate(
  container: HTMLElement,
  onNavigate: (path: string) => void
): () => void {
  const handler = (e: MouseEvent) => {
    const link = (e.target as HTMLElement).closest('[data-nav]') as HTMLElement | null;
    if (link?.dataset.nav) {
      e.preventDefault();
      onNavigate(link.dataset.nav);
    }
  };
  container.addEventListener('click', handler);
  return () => container.removeEventListener('click', handler);
}
