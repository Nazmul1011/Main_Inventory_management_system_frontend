import React from 'react'
import { HeroSection } from './HeroSection'
import { KeyFeaturesSection } from './KeyFeaturesSection'
import { Ready_to_take } from './Ready_to_take'
import {FooterHome} from './footerHome'
import LogoSection from './logo_section'
import Service from './service'
import Testimonial from './testimonial'
import Blogs from './blogs/blogs'
import ContactUs from './Contactus'
import Help from './help'

function Home () {
  return (
    <>
      <div>
        <section id="hero-section">
          <HeroSection />
        </section>
      </div>

      <div>
        <section id="key-features-section">
          <KeyFeaturesSection />
        </section>
      </div>

      <LogoSection />
      <div section id="service-section">
        <Service />
      </div>
      <div section id="testimonial-section">
        <Testimonial />
      </div>
      <div>
        <section id="blogs-section">
          <Blogs />
        </section>
      </div>

      <div>
        <section id="Contactus-section">
          <ContactUs />
        </section>
      </div>

      <div>
        <section id="Help-section">
          <Help />
        </section>
      </div>
      <Ready_to_take />
    </>
  );
}

export default Home
