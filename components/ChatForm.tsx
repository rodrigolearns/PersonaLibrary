import styles from '@/styles/Home.module.css';
import LoadingDots from '@/components/ui/LoadingDots';

interface ChatFormProps {
  loading: boolean;
  query: string;
  setQuery: (query: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleEnter: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const ChatForm: React.FC<ChatFormProps> = ({ loading, query, setQuery, handleSubmit, handleEnter }) => {
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        disabled={loading}
        onKeyDown={handleEnter}
        autoFocus={false}
        rows={1}
        maxLength={512}
        id="userInput"
        name="userInput"
        placeholder={
          loading
            ? 'Waiting for response...'
            : 'What knowledge are you seeking?'
        }
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.textarea}
      />
      <button
        type="submit"
        disabled={loading}
        className={styles.generatebutton}
      >
        {loading ? (
          <div className={styles.loadingwheel}>
            <LoadingDots color="#000" />
          </div>
        ) : (
          // Send icon SVG in input field
          <svg
            viewBox="0 0 20 20"
            className={styles.svgicon}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        )}
      </button>
    </form>
  );
};
