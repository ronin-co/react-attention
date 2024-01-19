'use client';

import { type MutableRefObject, createContext } from 'react';

export interface AttentionContextConfig {
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

export const AttentionContext = createContext<AttentionContextValue | null>(null);
