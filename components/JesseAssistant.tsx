import React from 'react';
import Image from 'next/image';

interface JesseAssistantProps {
  showJesse: boolean;
  toggleJesseVisibility: () => void;
  sendMessage: (inputElement: HTMLInputElement, historyRef: React.RefObject<HTMLDivElement>) => void;
  miniChatHistoryRef: React.RefObject<HTMLDivElement>;
}

const JesseAssistant: React.FC<JesseAssistantProps> = ({
  showJesse,
  toggleJesseVisibility,
  sendMessage,
  miniChatHistoryRef,
}) => {
  return (
    <>
      <div id="jesse-assistant" onClick={toggleJesseVisibility}>
        <Image src="/images/Jesse L. Bones (2).png" alt="Jesse L. Bones AI Assistant" className="jesse-icon" width={90} height={90}
             onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/90x90/58BBB6/FFFFFF?text=Jesse'; }}/>
      </div>
      <div className={`chat-bubble ${showJesse ? 'active' : ''}`} id="jesse-chat-bubble">
        <div className="chat-history" ref={miniChatHistoryRef}>
          {/* Messages will be rendered here by useEffect in the parent component */}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <input type="text" placeholder="Type your message..." className="chat-message-input" id="jesse-mini-chat-input"
                 onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(e.target as HTMLInputElement, miniChatHistoryRef); }}/>
          <button className="chat-send-button" onClick={() => {
            const inputElement = document.getElementById('jesse-mini-chat-input') as HTMLInputElement;
            if (inputElement) {
              sendMessage(inputElement, miniChatHistoryRef);
            }
          }}>
            📤
          </button>
        </div>
      </div>
    </>
  );
};

export default JesseAssistant;
