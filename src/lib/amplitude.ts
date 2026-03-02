'use client';

import * as amplitude from '@amplitude/unified';

function initAmplitude() {
  if (typeof window !== 'undefined') {
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      console.log('[Amplitude] Disabled in development mode');
      return;
    }
    
    amplitude.initAll(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!, {
      analytics: {
        autocapture: true,
      },
      sessionReplay: {
        sampleRate: 1,
      },
    });
  }
}

initAmplitude();

export const Amplitude = () => null;
export default amplitude;