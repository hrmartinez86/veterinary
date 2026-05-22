import Navbar   from '../components/Navbar';
import Hero     from '../components/Hero';
import Services from '../components/Services';
import About    from '../components/About';
import Contact  from '../components/Contact';
import Footer   from '../components/Footer';

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
