import React, { useContext } from 'react';
import ButtonContext from '@/contexts/buttonContext';
import { PersonaConfiguration } from '@/config/PersonaConfigurations'; // Import PersonaConfiguration

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const buttons = PersonaConfiguration.map(persona => persona.name); // Use the name property of each persona
  
  const context = useContext(ButtonContext);

  if (!context) {
    throw new Error('ButtonContext is undefined, did you forget to wrap the component in a ButtonContext.Provider?');
  }
  
  const { activeButtons, setActiveButtons } = context;
  
  const handleClick = (index: number) => {
    setActiveButtons((prev: boolean[]) => {
      const newActiveButtons = [...prev];
      newActiveButtons[index] = !newActiveButtons[index];
      return newActiveButtons;
    });
  };
  
  return (
    <div className="mx-auto flex flex-col space-y-4">
      <header className="container sticky top-0 z-40 bg-white">
        <div className="h-16 border-b border-b-slate-200 py-4">
          <nav className="flex ml-4 pl-6 space-x-4 justify-center">
            {buttons.map((name, index) => (
              <button
                key={name}
                onClick={() => handleClick(index)}
                className={`px-3 py-1 rounded ${
                  activeButtons[index]
                    ? 'bg-slate-600 text-white'
                    : 'hover:text-slate-600'
                } cursor-pointer`}
              >
                {name}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <div>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
