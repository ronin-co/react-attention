'use client';

import { type MutableRefObject, useEffect, useContext } from 'react';

import AttentionContext from './context';

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
  if (!attention)
    throw new Error('`useAttention` can only be used inside `AttentionProvider`.');

  useEffect(() => {
    if (!claiming) return;

    const attentionId = attention.itemAppeared({
      blur,
      ref: element !== null ? element : undefined,
    });

    return () => attention.itemDisappeared(attentionId);
  }, [claiming]);
};

export default useAttention;
