interface Window {
  gtag: (
    command: 'config' | 'event' | 'js',
    targetId: string,
    options?: { [key: string]: any }
  ) => void;
} 