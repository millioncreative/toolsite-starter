/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/mdx" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
