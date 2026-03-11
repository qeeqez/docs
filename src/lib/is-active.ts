function normalize(url: string) {
  if (url.length > 1 && url.endsWith("/")) return url.slice(0, -1);
  return url;
}

type ActiveOptions = {
  nested?: boolean;
  activeSubfolders?: string[];
};

export function isActive(url: string, pathname: string, options: ActiveOptions = {}): boolean {
  const {nested = true, activeSubfolders} = options;
  url = normalize(url);
  pathname = normalize(pathname);

  const isSubfolderActive =
    activeSubfolders?.some((subfolder) => {
      const normalizedSubfolder = normalize(subfolder);
      return pathname === normalizedSubfolder || pathname.startsWith(`${normalizedSubfolder}/`);
    }) ?? false;

  return url === pathname || (nested && pathname.startsWith(`${url}/`)) || isSubfolderActive;
}
