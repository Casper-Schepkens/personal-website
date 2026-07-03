import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function SiteLayout({ children }) {
  return (
    <ThemeProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </ThemeProvider>
  );
}