import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SocketProvider } from "@/contexts/SocketContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <SocketProvider>
        <div className={`${montserrat.variable} font-sans`}>
          <Component {...pageProps} />
        </div>
      </SocketProvider>
    </ThemeProvider>
  );
}
