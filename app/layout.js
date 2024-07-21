import { SupabaseProvider } from './supabaseContext';
import "./globals.css";

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
