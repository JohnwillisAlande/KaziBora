import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import NewArrivals from "../components/NewArrivals";
import Story from "../components/Story";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <CategoryGrid />
      <NewArrivals />
      <Story />
      <Footer />
    </main>
  );
}