// pages/index.tsx
'use client'; // This directive marks the component as a Client Component

import React, { useEffect, useRef, useState } from 'react';
// Removed Three.js and GLTFLoader imports
import Image from 'next/image';
import JesseAssistant from '../components/JesseAssistant';

export default function Home() {
  const [jesseChatActive, setJesseChatActive] = useState(false);
  // Initialize chat history with Jesse's first message
  const [chatHistory, setChatHistory] = useState([{ role: "model", parts: [{ text: "Hello! I'm Jesse, your AI legacy advisor. How can I help you on your journey today?" }] }]);
  const miniChatHistoryRef = useRef(null); // Ref for the mini chat history

  // Function to toggle Jesse's chat bubble visibility
  const toggleJesseChat = () => {
    setJesseChatActive(prev => !prev);
  };

  // Function to send messages to Jesse AI
  const sendMessage = async (inputElement, historyRef) => {
    const message = inputElement.value.trim();
    if (!message) return;

    inputElement.value = ''; // Clear input field

    // Add user message to history
    const newUserMessage = { role: "user", parts: [{ text: message }] };
    setChatHistory(prev => [...prev, newUserMessage]);

    // Add a loading indicator for Jesse's response
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message jesse';
    loadingDiv.innerHTML = '<div class="chat-message-content">Jesse is typing<span class="chat-loading-indicator">...</span></div>';
    historyRef.current.appendChild(loadingDiv);
    historyRef.current.scrollTop = historyRef.current.scrollHeight; // Scroll to bottom

    try {
      const apiKey = ""; // Canvas will provide this at runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const payload = { contents: [...chatHistory, newUserMessage] }; // Include new user message in payload

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      // Remove loading indicator
      if (historyRef.current && loadingDiv.parentNode === historyRef.current) {
        historyRef.current.removeChild(loadingDiv);
      }

      let jesseResponseText = "I'm sorry, I couldn't generate a response at this time.";
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        jesseResponseText = result.candidates[0].content.parts[0].text;
      } else {
        console.error("Gemini API response structure unexpected:", result);
      }
      
      const newJesseMessage = { role: "model", parts: [{ text: jesseResponseText }] };
      setChatHistory(prev => [...prev, newJesseMessage]); // Update state with Jesse's response

    } catch (error) {
      // Remove loading indicator
      if (historyRef.current && loadingDiv.parentNode === history.current) {
        history.current.removeChild(loadingDiv);
      }
      const errorMessage = { role: "model", parts: [{ text: "I'm experiencing a technical difficulty. Please try again later." }] };
      setChatHistory(prev => [...prev, errorMessage]);
      console.error("Error calling Gemini API:", error);
    }
  };

  // Effect to render chat history whenever it changes
  useEffect(() => {
    const renderChat = (historyContainer, historyData) => {
      if (!historyContainer) return;
      historyContainer.innerHTML = ''; // Clear current display
      historyData.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${msg.role === 'user' ? 'user' : 'jesse'}`;
        messageDiv.innerHTML = `<div class="chat-message-content">${msg.parts[0].text}</div>`;
        historyContainer.appendChild(messageDiv);
      });
      historyContainer.scrollTop = historyContainer.scrollHeight; // Scroll to bottom
    };

    // Render for mini chat history
    renderChat(miniChatHistoryRef.current, chatHistory);
  }, [chatHistory]);


  // Removed Three.js useEffect hook
  // Removed mountRef as it's no longer needed for Three.js

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
        <a href="#podcasts">Podcasts</a> {/* Added Podcast link */}
        <a href="#blogs">Blogs</a>       {/* Added Blog link */}
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Live Fully. Die Ready.</h1>
          <p className="hero-subtitle">
            Transform life’s most important conversation into your greatest legacy
          </p>
          <button className="cta-button">Begin Your Legacy Journey</button>
        </div>
        {/* 2D Tree with Animated Roots */}
        <div className="tree-background">
          <Image
            src="/images/tree with orange circuits for website.png" 
            alt="Tree with Circuit Board Roots" 
            className="tree-image" 
            width={1200}
            height={800}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/1200x800/08123A/FF5D00?text=Tree+Image+Missing'; }}
          />
          <div className="roots-overlay"></div> {/* For pulsating roots effect */}
        </div>
      </section>

      {/* About the Founder Section (Niki Weiss) */}
      <AboutFounder />

      {/* Agent Profile Section (Jesse L. Bones) */}
      <AgentProfile />

      {/* Niki's Podcasts Section */}
      <PodcastSection />

      {/* Niki's Blogs Section */}
      <BlogSection />

      {/* You can add other sections like Services, Pricing, Contact here as needed */}
      {/* For example:
      <section id="services" className="content-section">
        <h2>Our Services</h2>
        <p>Details about services...</p>
      </section>
      */}

      <JesseAssistant
        showJesse={jesseChatActive}
        toggleJesseVisibility={toggleJesseChat}
        chatHistory={chatHistory}
        sendMessage={sendMessage}
        miniChatHistoryRef={miniChatHistoryRef}
      />
    </>
  );
}

// AgentProfile Component for Jesse L. Bones (unchanged)
function AgentProfile() {
  return (
    <section id="agent" className="profile-section">
      <h2>Meet Jesse L. Bones</h2>
      <div className="agent-profile-content">
        <Image
          src="/images/Jesse L. Bones (2).png" // UPDATED TO .png
          alt="Jesse L. Bones"
          width={200}
          height={200}
          style={{ borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/200x200/58BBB6/FFFFFF?text=Jesse'; }}
        />
        <p>Jesse is Niki&apos;s lead agent and your guide throughout the journey.</p>
        <p>Trained on thousands of legacy planning scenarios, Jesse provides personalized, empathetic guidance throughout your journey.</p>
      </div>
    </section>
  );
}



function AboutFounder() {
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

function PodcastSection() {
  return (
    <section id="podcasts" className="profile-section"> {/* Reusing profile-section styles */}
      <h2>Niki&apos;s Podcasts</h2>
      <p>Tune into Niki&apos;s insights on legacy, life, and the future of planning.</p>
      <div className="podcast-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '2rem auto' }}>
        {/* Placeholder for individual podcast episodes */}
        <div className="podcast-card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '1.5rem', textAlign: 'left', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Image src="https://placehold.co/150x150/FF5D00/FFFFFF?text=Podcast+1" alt="Podcast Cover" width={150} height={150} style={{ width: '100%', height: 'auto', borderRadius: '10px', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--guiding-light)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Episode Title 1</h3>
          <p style={{ color: 'var(--compassionate-grey)', fontSize: '0.9rem', marginBottom: '1rem' }}>A deep dive into digital immortality.</p>
          <a href="#" style={{ color: 'var(--setting-sun)', textDecoration: 'none', fontWeight: 'bold' }}>Listen Now &rarr;</a>
        </div>
        <div className="podcast-card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '1.5rem', textAlign: 'left', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Image src="https://placehold.co/150x150/58BBB6/FFFFFF?text=Podcast+2" alt="Podcast Cover" width={150} height={150} style={{ width: '100%', height: 'auto', borderRadius: '10px', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--guiding-light)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Episode Title 2</h3>
          <p style={{ color: 'var(--compassionate-grey)', fontSize: '0.9rem', marginBottom: '1rem' }}>Navigating grief in the digital age.</p>
          <a href="#" style={{ color: 'var(--setting-sun)', textDecoration: 'none', fontWeight: 'bold' }}>Listen Now &rarr;</a>
        </div>
        <div className="podcast-card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '1.5rem', textAlign: 'left', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Image src="https://placehold.co/150x150/6B46C1/FFFFFF?text=Podcast+3" alt="Podcast Cover" width={150} height={150} style={{ width: '100%', height: 'auto', borderRadius: '10px', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--guiding-light)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Episode Title 3</h3>
          <p style={{ color: 'var(--compassionate-grey)', fontSize: '0.9rem', marginBottom: '1rem' }}>The intersection of AI and emotional legacy.</p>
          <a href="#" style={{ color: 'var(--setting-sun)', textDecoration: 'none', fontWeight: 'bold' }}>Listen Now &rarr;</a>
        </div>
      </div>
      <p style={{ marginTop: '2rem' }}>
        <a href="#" className="cta-button" style={{ textDecoration: 'none', display: 'inline-block', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>View All Podcasts</a>
      </p>
    </section>
  );
}

// Blog Section Component (unchanged)
function BlogSection() {
  return (
    <section id="blogs" className="profile-section"> {/* Reusing profile-section styles */}
      <h2>Niki&apos;s Blogs</h2>
      <p>Read Niki&apos;s latest articles on legacy planning, technology, and personal growth.</p>
      <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '2rem auto' }}>
        {/* Placeholder for individual blog posts */}
        <div className="blog-card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '1.5rem', textAlign: 'left', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <h3 style={{ color: 'var(--guiding-light)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Blog Post Title 1</h3>
          <p style={{ color: 'var(--compassionate-grey)', fontSize: '0.9rem', marginBottom: '1rem' }}>Exploring the nuances of digital wills.</p>
          <a href="#" style={{ color: 'var(--setting-sun)', textDecoration: 'none', fontWeight: 'bold' }}>Read More &rarr;</a>
        </div>
        <div className="blog-card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '1.5rem', textAlign: 'left', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <h3 style={{ color: 'var(--guiding-light)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Blog Post Title 2</h3>
          <p style={{ color: 'var(--compassionate-grey)', fontSize: '0.9rem', marginBottom: '1rem' }}>The future of personal data and legacy.</p>
          <a href="#" style={{ color: 'var(--setting-sun)', textDecoration: 'none', fontWeight: 'bold' }}>Read More &rarr;</a>
        </div>
        <div className="blog-card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '1.5rem', textAlign: 'left', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <h3 style={{ color: 'var(--guiding-light)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Blog Post Title 3</h3>
          <p style={{ color: 'var(--compassionate-grey)', fontSize: '0.9rem', marginBottom: '1rem' }}>How to start your legacy journey today.</p>
          <a href="#" style={{ color: 'var(--setting-sun)', textDecoration: 'none', fontWeight: 'bold' }}>Read More &rarr;</a>
        </div>
      </div>
      <p style={{ marginTop: '2rem' }}>
        <a href="#" className="cta-button" style={{ textDecoration: 'none', display: 'inline-block', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>View All Blogs</a>
      </p>
    </section>
  );
}
