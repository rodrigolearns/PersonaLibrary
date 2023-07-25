import '@/styles/base.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { ButtonContextProvider } from '@/contexts/buttonContext';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ButtonContextProvider>
      <main className={inter.variable}>
        <Component {...pageProps} />
      </main>
    </ButtonContextProvider>
  );
}

export default MyApp;
