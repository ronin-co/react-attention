'use client';

import { createContext } from 'react';
import type { AttentionContextValue } from './types';

const AttentionContext = createContext<AttentionContextValue | null>(null);

export default AttentionContext;
