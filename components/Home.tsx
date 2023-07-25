// Home.tsx
import { useRef, useState, useEffect, useContext } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import { Document } from 'langchain/document';
import ButtonContext from '@/contexts/buttonContext';
import { MessageList } from './MessageList';
import { ChatForm } from './ChatForm';
import { makeChain } from '@/utils/makechain'; // Import the makeChain function
import { PersonaConfiguration } from '@/utils/PersonaConfigurations'; // Import the PersonaConfiguration

// Define the Home component
export default function Home() {
  // Access activeButtons from ButtonContext
  const buttonContext = useContext(ButtonContext);

  if (!buttonContext) {
    throw new Error('Home must be used within a ButtonContext provider');
  }

  const { activeButtons } = buttonContext;

  // Define state variables
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [],
    history: [],
  });

  // Destructure variables from messageState
  const { messages, history } = messageState;

  // Define useRef variables
  const messageListRef = useRef<HTMLDivElement>(null);

  // Define function to handle multiple responses
  const handleMultipleResponses = (responses: any[]) => {
    // Update the messages state with the responses
    setMessageState((state) => ({
      ...state,
      messages: responses.map((response, i) => ({
        message: response,
        type: 'apiMessage',
        persona: PersonaConfiguration[i].name, // Add the name of the persona to the message
      })),
    }));
  };

// Define function to handle form submission
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent default form submission behavior
    e.preventDefault();
  
    // Reset error state
    setError(null);
  
    // Check if query is empty
    if (!query) {
      alert('Please input a question');
      return;
    }
  
    // Trim the question
    const question = query.trim();
  
    console.log('Form submitted with question:', question);
  
    // Get the names of the active personas
    const activePersonas = activeButtons.map((isActive, i) => isActive ? PersonaConfiguration[i].name : null).filter(Boolean) as string[];

    /*// Create the chain with the active personas
    const chains = await makeChain(pineconeStore, activePersonas);
    */
   
    // Send the question and chat history to the chat API endpoint
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        history,
        activePersonas,
      }),
    });
  
    const data = await response.json();
  
    // Handle the responses
    handleMultipleResponses(data);
  };
  
  // Define function to prevent empty submissions
  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Implement your key press logic here
  };

  // Use useEffect to update the initial message based on activeButtons
  useEffect(() => {
    let initialMessage = '';
    if (activeButtons.every(val => val === false)) {
      initialMessage = 'Please select one or more Personas to help you in your query.';
    } else {
      initialMessage = activeButtons.filter(Boolean).length > 1
        ? 'Hello dear colleague! What would you like to learn about our published literature?'
        : 'Hello dear colleague! What would you like to learn about my published literature?';
    }

    setMessageState((state) => ({
      ...state,
      messages: [
        {
          message: initialMessage,
          type: 'apiMessage',
        },
      ],
    }));
  }, [activeButtons]);

  // Return the component's JSX
  return (
    <>
      <Layout>
        <div className="mx-auto flex flex-col gap-4">
          <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center">
            P E R S O N A - L I B R A R Y
          </h1>
          <main className={styles.main}>
            <div className={styles.cloud}>
              <div ref={messageListRef} className={styles.messagelist}>
                <MessageList messages={messages} activeButtons={activeButtons} loading={loading} />
              </div>
            </div>
            <div className={styles.center}>
              <div className={styles.cloudform}>
                <ChatForm loading={loading} query={query} setQuery={setQuery} handleSubmit={handleSubmit} handleEnter={handleEnter} />
              </div>
            </div>
            {error && (
              <div className="border border-red-400 rounded-md p-4">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </main>
        </div>
        <footer className="m-auto p-4" style={{textAlign: "center"}}>
          <a href="https://twitter.com/mayowaoshin">
            Powered by LangChainAI. Demo built by Mayo (Twitter: @mayowaoshin).
          </a>
          <br/>
          <a href="https://www.linkedin.com/in/rodrigo-rosas-6a0743111">
            Custom text extraction of research paper content and 2nd LLM pass system implemented by Rodrigo Rosas-Bertolini (LinkedIn)
          </a>.
        </footer>

      </Layout>
    </>
  );
}