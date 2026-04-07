'use client';

import { useEffect } from 'react';
import * as amplitude from '@amplitude/unified';

export const Amplitude = () => {
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

    if (!apiKey) {
      return;
    }

    amplitude.initAll(apiKey, {
      analytics: {
        autocapture: true,
      },
      sessionReplay: {
        sampleRate: 1,
      },
    });
  }, []);

  return null;
};

export default amplitude;
