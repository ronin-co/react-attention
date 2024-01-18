import { type MutableRefObject, useEffect, useRef, ReactNode, JSX, createContext } from 'react';

interface AttentionContextConfig {
  /**
   * A function that resets the UI element back to its original state, which is
   * used to reset the element if a different element claims the attention.
   */
  blur: () => void;
  /**
   * A reference of the DOM element associated with the UI element, which is
   * used to reset the element when a click happens outside of it.
   */
  ref?: MutableRefObject<HTMLElement | null>;
}

interface AttentionContextValue {
  itemAppeared: (config: AttentionContextConfig) => string;
  itemDisappeared: (id: string) => void;
}

const AttentionContext = createContext<AttentionContextValue | null>(null);

interface AttentionContextProviderProps {
    children: ReactNode;
}

// This component is used for keeping track of which UI element is currently
// claiming the user's undivided attention (such as a confirmation prompt).
// Every time such an item appears, it should be stored in this context, so that
// other UI items claiming the user's attention afterwards can hide it, which
// prevents multiple UI elements of this kind trying to claim the user's
// attention at the same time.
const AttentionContextProvider = ({ children }: AttentionContextProviderProps): JSX.Element => {
  const items = useRef<Map<string, AttentionContextConfig>>(new Map());

  // This gets called whenever a new item is showing.
  const itemAppeared = (config: AttentionContextConfig): string => {
    for (const [id, storedConfig] of items.current.entries()) {
      storedConfig.blur();
      items.current.delete(id);
    }

    // This ID must be unique across the entire app, so we can't use React's `useId`.
    const id = crypto.randomUUID();

    items.current.set(id, config);
    return id;
  };

  // This gets called whenever a visible item is hiding.
  const itemDisappeared = (id: string): void => {
    items.current.delete(id);
  };

  // When people click outside the item that is currently grabbing attention,
  // we want to blur it (reset it to its initial state).
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      for (const [id, storedConfig] of items.current.entries()) {
        const ref = 'ref' in storedConfig ? (storedConfig.ref as MutableRefObject<HTMLElement | null>) : null;
        const element = ref?.current;

        if (!element) continue;

        const isInside = element.contains(event.target as Node);
        if (isInside) continue;

        storedConfig.blur();
        items.current.delete(id);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <AttentionContext.Provider value={{ itemAppeared, itemDisappeared }}>
      {children}
    </AttentionContext.Provider>
  );
};

export { AttentionContextProvider };
