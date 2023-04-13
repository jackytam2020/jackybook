declare module '@microlink/react' {
  import { ComponentType } from 'react';

  interface MicrolinkProps {
    url: string;
    media?: string[];
  }

  const Microlink: ComponentType<MicrolinkProps>;

  export default Microlink;
}
