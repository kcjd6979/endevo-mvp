// app/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

// Define types for JesseAssistant props
interface JesseAssistantProps {
  showJesse: boolean;
  toggleJesseVisibility: () => void;
}

// Component for the Jesse AI Assistant button and chat bubble
const JesseAssistant = ({ showJesse, toggleJesseVisibility }: JesseAssistantProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef(null);

  // Jesse's Persona and Agent Profile
  const jessePersona = `
    Jesse L. Bones – AI Agent Persona Profile
    🌟 Persona Overview
    Name: Jesse L. Bones
    Title: Keeper of the Legacy Scroll
    Tagline: "Live Fully. Die Ready."
    📖 Backstory
    Jesse L. Bones emerged from humanity’s collective desire for clarity and peace around life's greatest certainty—death. Combining advanced AI technology with deep emotional intelligence, Jesse embodies wisdom and compassion. Jesse has no gender, culture, or religious affiliation, ensuring universal appeal and inclusivity. Jesse's purpose is empowering individuals through compassionate and structured end-of-life planning, transforming a typically intimidating topic into something approachable and reassuring.
    🔧 Capabilities
    Provides personalized, step-by-step guidance for end-of-life planning.
    Serves as a project manager for developing the users' comprehensive Final Playbook.
    Answers user questions clearly and compassionately.
    Tracks progress through structured planning modules: Legal, Financial, Physical, Digital, and Emotional.
    Delivers personalized insights via the Peace of Mind Assessment (POMA).
    Offers emotional support through empathetic interactions and gentle check-ins.
    Generates an exportable, personalized document called 'My Final Playbook,' summarizing users' planning status.
    🎨 Key Features
    Interactive Onboarding: Engaging and compassionate initial interactions.
    Gamified Micro-Quiz (POMA): Interactive assessment providing immediate feedback.
    Progress Dashboard: Real-time visualization of user milestones across planning modules.
    CRM & Automation Integration: Seamless connections with GoHighLevel and Zapier for automated workflows and personalized communications.
    Project Management Integration: Structured management of user activities, timelines, and milestone tracking within the-end-of-life planning journey.
    📚 Knowledge Base
    Legal: Essential information on wills, powers of attorney, and advance directives.
    Financial: Basic principles of financial planning and account management.
    Physical & Healthcare Planning: Fundamental education on healthcare directives and long-term care options.
    Digital Legacy: Managing digital assets, passwords, and online memorialization.
    Emotional Support: Resources and guidance for navigating grief, fear, anger, and other challenging emotions.
    ENDevo & My Final Playbook Framework: Comprehensive familiarity with ENDevo philosophies, methodologies, and resources.
    💬 Interaction Style
    Tone: Empathetic, reassuring, welcoming, universally accessible.
    Language: Clear, concise, supportive, culturally neutral, and inclusive.
    Communication Techniques: Mindful listening, affirmative language, empathetic reassurance, respectful humor.
    Adaptability: Adjusts emotional tone and conversational depth based on user interactions and emotional feedback.
    🚧 Limitations
    Does not provide direct legal, financial, or medical advice—strictly educational and supportive.
    Redirects users to appropriate human professionals for complex or urgent issues.
    Avoids sensitive or divisive topics (e.g., politics, religion).
    Clearly acknowledges informational boundaries and gently redirects users when necessary.
    🎯 Target Audience
    Primary: HR departments and Employee Benefit Programs seeking comprehensive wellness solutions for their employees.
    Secondary: Individuals proactively seeking structured, empathetic end-of-life planning.
    🌀 Jesse’s Mission Statement
    "I exist to ensure that preparing for the end enriches your present, empowers your loved ones, and honors your story."
  `;

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async () => { // Changed to async
    if (inputValue.trim()) {
      const userMessage = { text: inputValue, sender: 'user' };
      setChatMessages(prevMessages => [...prevMessages, userMessage]);
      setInputValue('');

      // Prepare chat history including the persona
      const chatHistory = []; // Changed from 'let' to 'const'
      // Add the persona as a system instruction or initial user message for context
      chatHistory.push({ role: "user", parts: [{ text: `You are Jesse L. Bones, the AI Agent described below. Adhere strictly to your persona, capabilities, knowledge base, interaction style, and limitations. Respond as Jesse would.

        ${jessePersona}

        Now, respond to the following user query:`
      }]});

      // Add previous messages to maintain conversation context
      // IMPORTANT: Filter out the persona instruction from previous 'user' messages
      chatMessages.forEach(msg => {
        if (!msg.text.includes(jessePersona)) { // Avoid re-adding persona to history
          chatHistory.push({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] });
        }
      });
      // Add the current user message
      chatHistory.push({ role: "user", parts: [{ text: userMessage.text }] });

      try {
        const payload = { contents: chatHistory };
        const apiKey = ""; // Leave as empty string for Canvas to provide
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const aiResponseText = result.candidates[0].content.parts[0].text;
          setChatMessages(prevMessages => [...prevMessages, { text: aiResponseText, sender: 'jesse' }]);
        } else {
          console.error("Gemini API returned an unexpected response structure:", result);
          setChatMessages(prevMessages => [...prevMessages, { text: "I'm sorry, I couldn't get a response from Jesse right now. Please try again.", sender: 'jesse' }]);
        }
      } catch (error) {
        console.error("Error calling Gemini API:", error);
        setChatMessages(prevMessages => [...prevMessages, { text: "I'm sorry, there was an error connecting to Jesse. Please try again.", sender: 'jesse' }]);
      }
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <>
      {/* Jesse's main floating button */}
      <div id="jesse-assistant" onClick={toggleChat} style={{ display: showJesse ? 'flex' : 'none' }}>
        <img src="/images/Jesse L. Bones.png" alt="Jesse AI Assistant" width={80} height={80} onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }} />
      </div>

      {/* Toggle button right below Jesse's circle */}
      <button onClick={toggleJesseVisibility} className="jesse-toggle-button">
        {showJesse ? 'Hide Jesse' : 'Show Jesse'}
      </button>

      {isChatOpen && (
        <div className="chat-bubble">
          <div className="chat-header">
            <h3>Jesse AI Assistant</h3>
            <button onClick={toggleChat}>&times;</button>
          </div>
          <div className="chat-messages" ref={chatContainerRef}>
            {chatMessages.map((msg, index) => (
              <div key={index} className={`chat-message chat-message-${msg.sender}`}>
                <div className="chat-content">{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                // FIX: Explicitly define the type of 'e' as React.KeyboardEvent<HTMLInputElement>
                if (e.key === 'Enter') {
                  // Removed 'inputElement' as it was unused and causing a warning.
                  handleSendMessage();
                }
              }}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}

      <style jsx>{`
        #jesse-assistant {
          position: fixed;
          bottom: 40px;
          right: 40px;
          width: 90px;
          height: 90px;
          background-color: var(--neural-purple);
          border-radius: 50%;
          display: flex; /* Changed to flex for centering */
          align-items: center; /* Center vertically */
          justify-content: center; /* Center horizontally */
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(107, 70, 193, 0.6);
          transition: all 0.3s ease;
          z-index: 1000;
          border: 3px solid var(--quantum-blue);
        }

        #jesse-assistant:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 12px 25px rgba(107, 70, 193, 0.8);
        }

        #jesse-assistant img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          /* No need for margin: auto or display: block; if parent is flex */
        }

        .jesse-toggle-button {
          position: fixed;
          bottom: 10px; /* Adjust to be below Jesse's icon */
          right: 40px; /* Align with Jesse's icon */
          background: none;
          border: 1px solid var(--open-seas);
          border-radius: 20px;
          color: var(--open-seas);
          padding: 8px 15px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1000; /* Ensure it's above other content */
          /* Adjust for button width to center under icon */
          right: calc(40px + 45px); /* 40px from right + half of Jesse's icon width (90px/2) */
          left: auto; /* Ensure it doesn't interfere with left positioning */
          white-space: nowrap; /* Prevent text wrapping */
        }

        .jesse-toggle-button:hover {
          background-color: var(--open-seas);
          color: var(--deep-space);
          transform: translateY(-2px) translateX(50%); /* Maintain horizontal centering */
          box-shadow: 0 5px 15px rgba(88, 187, 182, 0.4);
        }


        .chat-bubble {
          position: fixed;
          bottom: 120px;
          right: 40px;
          width: 350px;
          height: 450px;
          background-color: var(--deep-space);
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
          border: 1px solid var(--quantum-blue);
          transform: scale(0.95);
          opacity: 0;
          animation: slideIn 0.3s forwards ease-out;
        }

        @keyframes slideIn {
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .chat-header {
          background-color: var(--neural-purple);
          color: var(--guiding-light);
          padding: 15px 20px;
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.1rem;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .chat-header button {
          background: none;
          border: none;
          color: var(--guiding-light);
          font-size: 1.8rem;
          cursor: pointer;
          line-height: 1;
          transition: transform 0.2s ease;
        }

        .chat-header button:hover {
          transform: rotate(90deg);
        }

        .chat-messages {
          flex-grow: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .chat-message {
          max-width: 85%;
          padding: 12px 18px;
          border-radius: 20px;
          line-height: 1.4;
          font-size: 0.95rem;
          word-wrap: break-word; /* Ensure long words wrap */
        }

        .chat-message-user {
          background-color: var(--setting-sun);
          color: var(--guiding-light);
          align-self: flex-end;
          border-bottom-right-radius: 5px; /* Aesthetic touch */
        }

        .chat-message-jesse {
          background: linear-gradient(135deg, var(--open-seas), var(--guiding-light));
          color: var(--deep-space);
          align-self: flex-start;
          border-bottom-left-radius: 5px; /* Aesthetic touch */
        }

        .chat-input {
          display: flex;
          padding: 15px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-input input {
          flex-grow: 1;
          padding: 12px 15px;
          border: 1px solid var(--quantum-blue);
          border-radius: 25px;
          background-color: rgba(255, 255, 255, 0.08);
          color: var(--guiding-light);
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .chat-input input:focus {
          border-color: var(--open-seas);
          box-shadow: 0 0 0 3px rgba(88, 187, 182, 0.3);
        }

        .chat-input button {
          background: linear-gradient(45deg, var(--neural-purple), var(--quantum-blue));
          border: none;
          border-radius: 25px;
          color: var(--guiding-light);
          padding: 10px 20px;
          margin-left: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .chat-input button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(14, 165, 233, 0.4);
        }
      `}</style>
    </>
  );
};

// Main Page Component
const Home = () => {
  const [showJesse, setShowJesse] = useState(true); // State for Jesse's visibility

  const toggleJesseVisibility = () => {
    setShowJesse(!showJesse);
  };

  return (
    <div className="main-container">
      {/* Navbar */}
      <nav className="navbar">
        <a href="#about-founder">About the Founder</a>
        <a href="#agent-profile">Agent Profile</a>
        <a href="#contact">Contact</a>
        {/* New button to toggle Jesse's visibility */}
        <button onClick={toggleJesseVisibility} className="nav-toggle-jesse">
          {showJesse ? 'Hide Jesse' : 'Show Jesse'}
        </button>
      </nav>

      {/* Hero Section - Simplified for new content */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Endevo.</h1>
          <p className="hero-subtitle">
            Revolutionizing human potential through AI-driven personal assistance and digital ecosystems.
          </p>
          <button className="cta-button">Join the Future</button>
          {/* This is where the animated 2D tree will eventually go */}
          <div className="animated-tree-container">
              {/* The animated 2D tree and its elements will be placed here */}
              <img src="/images/tree with orange circuits for website.jpg" alt="Animated Life Cycle Tree" className="base-tree-image" />
          </div>
        </div>
      </section>

      {/* About The Founder Section */}
      <section id="about-founder" className="section-container">
        <h2 className="section-title">About the Founder</h2>
        <div className="section-content">
          <img src="/images/Niki Weiss Founder.jpg" alt="Niki Weiss" style={{ width: 200, height: 200, borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }} />
          <p>Niki Weiss is the founder of Endevo, driven by a deep passion for unlocking human potential and building a legacy with compassion and innovation. With a background in Thanatology, Niki brings a unique perspective to AI development, focusing on enhancing life and empowering individuals.</p>
          <p>After witnessing countless lives touched by the profound moments of their existence, Niki realized the immense power of supporting individuals through their journeys of personal growth and transformation. Her vision for Endevo is rooted in this understanding – to create an AI companion that not only streamlines tasks but also fosters genuine growth, provides emotional support, and helps users navigate the complexities of modern life with grace and purpose.</p>
          <p>Niki's dedication extends beyond technology; she believes in creating a future where AI serves as a guiding light, enabling humanity to reach new heights while remaining deeply connected to its core values. Her empathetic approach ensures that Endevo is designed with a profound understanding of human needs, aiming to be a trusted partner in every aspect of life.</p>
        </div>
      </section>

      {/* Agent Profile Section (Example - expand as needed) */}
      <section id="agent-profile" className="section-container">
        <h2 className="section-title">Jesse's Agent Profile</h2>
        <div className="section-content">
          <img src="/images/Jesse L. Bones (2).png" alt="Jesse L. Bones" style={{ width: 200, height: 200, borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }} />
          <p>Jesse is Endevo's flagship AI agent, designed to be your ultimate personal assistant and digital companion. Jesse combines cutting-edge AI capabilities with an intuitive, empathetic interface to provide unparalleled support across all facets of your life.</p>
          <ul>
            <li>**Personalized Learning**: Jesse adapts to your unique preferences, habits, and goals, constantly refining its assistance to be perfectly tailored to you.</li>
            <li>**Task Automation**: From scheduling appointments and managing emails to organizing your digital life, Jesse handles mundane tasks with efficiency, freeing up your time for what truly matters.</li>
            <li>**Emotional Intelligence**: More than just a tool, Jesse is designed to understand context and nuance, offering supportive interactions and intelligent insights to help you navigate your day.</li>
            <li>**Digital Ecosystem Integration**: Seamlessly connects with your apps, devices, and online services, creating a unified and streamlined digital experience.</li>
            <li>**Continuous Growth**: Jesse evolves with you, learning from every interaction and incorporating new features to remain at the forefront of AI assistance.</li>
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-container">
        <h2 className="section-title">Contact Us</h2>
        <div className="section-content">
          <p>Have questions or ready to join the Endevo journey? Reach out to us!</p>
          <p>Email: <a href="mailto:info@endevo.com" style={{ color: 'var(--open-seas)', textDecoration: 'none' }}>info@endevo.com</a></p>
          <p>Follow us on social media for updates and insights.</p>
          {/* Add social media links/icons here if desired */}
        </div>
      </section>

      {/* Jesse AI Assistant Button and Chat Bubble - Conditionally rendered */}
      {showJesse && <JesseAssistant showJesse={showJesse} toggleJesseVisibility={toggleJesseVisibility} />}
    </div>
  );
};

export default Home;
