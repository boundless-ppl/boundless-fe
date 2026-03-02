'use client';

import * as amplitude from '@amplitude/unified';

function initAmplitude() {
  if (typeof window !== 'undefined') {
    amplitude.initAll('a0b60c3d204b818f3db70cb40ae76136', {"analytics":{"autocapture":true},"sessionReplay":{"sampleRate":1}});
  }
}

initAmplitude();

export const Amplitude = () => null;
export default amplitude;