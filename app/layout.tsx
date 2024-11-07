import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Acton",
  description: "Acton: Mapeamento de Sintoma",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props;

  return (
    <html lang="pt-br">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-SK3K7H3XD3"></Script>
        <Script
          id="gtag"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){
                dataLayer.push(arguments);
              }
              gtag('js', new Date());
              gtag('config', 'G-SK3K7H3XD3');
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({
                  'gtm.start': new Date().getTime(),
                  event:'gtm.js'
                });
                var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PMR2HNVH');
              gtag('event', 'conversion', {'send_to': 'AW-950806467/LPOlCKqdy6kZEMPPsMUD'});
            `,
          }}
        />
        <meta property="og:url" content="https://web-acton.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Acton: Mapeamento de Sintomas" />
        <meta
          property="og:description"
          content="Site de teste para a aplicação: Acton"
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/myself-dg.appspot.com/o/acton-test.png?alt=media&token=21db8f49-3679-4d63-ae43-dbc0ad0d73a1&_gl=1*zhnxkr*_ga*NjQyODkxOTU4LjE2ODU5MjYxNTU.*_ga_CW55HF8NVT*MTY4NTkyNjE1NC4xLjEuMTY4NTkyNjE4NS4wLjAuMA.."
        />
      </head>
      <body className={inter.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PMR2HNVH"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}>
          </iframe>
        </noscript>
        {children}
      </body>
    </html>
  );
}
