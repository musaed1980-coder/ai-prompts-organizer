
import React from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, language = 'json' }) => {
  return (
    <div className="bg-gray-800 text-white rounded-lg my-4 overflow-hidden" dir="ltr">
      <div className="bg-gray-700 px-4 py-2 text-sm text-gray-300 font-mono flex justify-between items-center">
        <span>{language}</span>
        <button 
          onClick={() => navigator.clipboard.writeText(String(children))}
          className="text-gray-400 hover:text-white transition-colors text-xs"
        >
          Copy
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  );
};
