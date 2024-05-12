import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Import global styles here
import Layout from './layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
