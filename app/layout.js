import { SupabaseProvider } from './supabaseContext';
import "./globals.css";
export const metadata = {
  title: "Chill 2.0",
  description: "Stiamo Sistemando i cuscini,torna presto",
  openGraph: {
    titolo:"Chill 2.0",
    description:"Stiamo Sistemando i cuscini,torna presto",
    images: [`/logo.jpg`],
 
  }
};
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
