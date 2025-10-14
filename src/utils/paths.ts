const rawBase = import.meta.env.BASE_URL ?? '/';
const ensureTrailingSlash = (value: string) => (value.endsWith('/') ? value : `${value}/`);
const base = ensureTrailingSlash(rawBase);

export const withBase = (path: string): string => {
  const cleaned = path.replace(/^\//, '');
  return `${base}${cleaned}`;
};

export const stripBase = (path: string): string => {
  if (!path) {
    return path;
  }
  if (base === '/') {
    return path;
  }
  if (!path.startsWith(base)) {
    return path;
  }
  const remainder = path.slice(base.length);
  if (!remainder) {
    return '/';
  }
  return remainder.startsWith('/') ? remainder : `/${remainder}`;
};
