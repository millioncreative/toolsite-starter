import { type Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        accent: '#f97316'
      }
    }
  },
  plugins: []
};

export default config;
