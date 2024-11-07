import "./globals.css";
import { Inter } from "next/font/google";

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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SK3K7H3XD3"></script>
        <script
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1271906727305977');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1271906727305977&ev=PageView&noscript=1"
          />
        </noscript>
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
      {children}</body>
    </html>
  );
}
