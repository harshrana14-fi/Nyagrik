'use client';

import { useEffect } from 'react';

const HelpBot = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      window.voiceflow.chat.load({
        verify: { projectID: '6867bf1f94f359fa0c3a3c66' },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        voice: {
          url: 'https://runtime-api.voiceflow.com',
        },
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; 
};

export default HelpBot;
// This component loads the Voiceflow chat widget asynchronously
