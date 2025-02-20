import { Metadata } from "next";

import "./globals.css";

export const metadata = {
  title: "BeeTrip Tennis Match",
  description: "Simulation d'un match de tennis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
