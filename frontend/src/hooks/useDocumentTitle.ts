import { useEffect } from 'react';

const APP_NAME = 'EchoLang';

/**
 * Custom React hook that manages the browser's document title.
 *
 * Sets the document title to the provided title with the app name suffix,
 * or just the app name if no title is provided. Automatically restores the
 * previous title when the component unmounts.
 *
 * @param title - The page-specific title to display. If empty, only the app name is shown.
 *
 * @example
 * ```tsx
 * function MyPage() {
 *   useDocumentTitle('Settings');
 *   // Document title will be: "Settings - EchoLang"
 *   return <div>Page content</div>;
 * }
 * ```
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} - ${APP_NAME}` : APP_NAME;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

