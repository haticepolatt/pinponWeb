import { Footer } from "./Footer";
import { Header } from "./Header";

export const PageShell = ({ children }) => (
  <div className="min-h-screen">
    <Header />
    <main className="pb-8 pt-4 md:pb-12 md:pt-6">{children}</main>
    <Footer />
  </div>
);
