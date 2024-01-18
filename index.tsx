import {
  type MutableRefObject,
  type ReactNode,
  type JSX,
  createContext,
  useEffect,
  useRef,
  useContext,
} from 'react';

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

interface AttentionProviderProps {
  children: ReactNode;
}

const AttentionContext = createContext<AttentionContextValue | null>(null);

// This component is used for keeping track of which UI element is currently
// claiming the user's undivided attention (such as a confirmation prompt).
// Every time such an item appears, it should be stored in this context, so that
// other UI items claiming the user's attention afterwards can hide it, which
// prevents multiple UI elements of this kind trying to claim the user's
// attention at the same time.
const AttentionProvider = ({ children }: AttentionProviderProps): JSX.Element => {
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
        const ref = storedConfig.ref?.current;
        if (!ref) continue;

        const isInside = ref.contains(event.target as Node);
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

/**
 * Allows components to claim the user's attention in the UI, by blurring
 * all other components that might be claiming attention.
 *
 * @param claiming Whether the component is currently claiming attention.
 *
 * @param blur A function for resetting the component back to its original
 * state whenever a different component claims the attention.
 *
 * @param element A reference to the DOM element associated with the component,
 * which is used to reset the component when a click happens outside of it. In
 * the case that the component wants to manage these events itself, `null` must
 * be passed explicitly, to ensure we never forget handling the events.
 */
const useAttention = (
  claiming: boolean,
  blur: () => void,
  element: MutableRefObject<HTMLDivElement | null> | null,
) => {
  const attention = useContext(AttentionContext);
  if (!attention) throw new Error('`useAttention` can only be used inside `AttentionProvider`.');

  useEffect(() => {
    if (!claiming) return;

    const attentionId = attention.itemAppeared({
      blur,
      ref: element !== null ? element : undefined,
    });

    return () => attention.itemDisappeared(attentionId);
  }, [claiming]);
};

export { AttentionProvider, useAttention };
