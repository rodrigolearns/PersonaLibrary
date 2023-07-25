// MessageList.tsx
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import styles from '@/styles/Home.module.css';

interface MessageListProps {
  messages: Message[];
  activeButtons: boolean[];
  loading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, activeButtons, loading }) => {
  return (
    <>
      {messages.map((message, index) => {
        // Define variables for icon and className based on message type
        let icon;
        let className;
        if (message.type === 'apiMessage') {
          icon = activeButtons.map((isActive, i) => isActive && (
            <Image
              key={i}
              src={`/${i + 1}.png`}
              alt="AI"
              width="40"
              height="40"
              className={styles.boticon}
              priority
            />
          ));
          className = styles.apimessage;
        } else {
          icon = (
            <Image
              key={index}
              src="/erick.png"
              alt="Me"
              width="30"
              height="30"
              className={styles.usericon}
              priority
            />
          );
          // The latest message sent by the user will be animated while waiting for a response
          className =
            loading && index === messages.length - 1
              ? styles.usermessagewaiting
              : styles.usermessage;
        }
        return (
          <div key={`chatMessage-${index}`} className={className}>
            {icon}
            <div className={styles.markdownanswer}>
              <ReactMarkdown linkTarget="_blank">
                {message.message}
              </ReactMarkdown>
              <p>{message.persona}</p> // Display the name of the persona
            </div>
          </div>
        );
      })}
    </>
  );
};
