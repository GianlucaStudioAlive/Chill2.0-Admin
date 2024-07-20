import { SupabaseProvider } from './supabaseContext';


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
