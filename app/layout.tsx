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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
