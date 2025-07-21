// components/AboutFounder.tsx
import React from 'react';
import Image from 'next/image';

export default function AboutFounder() {
  return (
    <section id="about-founder" className="profile-section">
      <h2>About Niki Weiss</h2>
      <div className="founder-gallery">
        <Image
          src="/images/Niki Weiss Founder.jpg"
          alt="Niki Weiss headshot 1"
          width={200}
          height={200}
          style={{ borderRadius: '10px', objectFit: 'cover' }}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/200x200/08123A/FF5D00?text=Niki+Weiss+1'; }}
        />
        <Image
          src="/images/Niki Weiss, Digital Thanatologist.jpg"
          alt="Niki Weiss headshot 2"
          width={200}
          height={200}
          style={{ borderRadius: '10px', objectFit: 'cover' }}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/200x200/08123A/FF5D00?text=Niki+Weiss+2'; }}
        />
        <Image
          src="/images/Niki Weiss.jpg"
          alt="Niki Weiss headshot 3"
          width={200}
          height={200}
          style={{ borderRadius: '10px', objectFit: 'cover' }}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/200x200/08123A/FF5D00?text=Niki+Weiss+3'; }}
        />
      </div>
      <p>
        Niki Weiss is the founder and digital thanatologist at ENDevo, helping people plan their
        legacy with compassion and cutting-edge technology.
      </p>
      <p>After witnessing countless families struggle with unprepared loss, Niki realized that our society&apos;s avoidance of death planning creates unnecessary suffering. Her mission: make legacy planning as natural as retirement planning.</p>
    </section>
  );
}
