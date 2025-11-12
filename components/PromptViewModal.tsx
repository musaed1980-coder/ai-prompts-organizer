import React, { useState } from 'react';
import { Prompt, Tool, Category } from '../types.ts';
import { StarRating } from './StarRating.tsx';
import { ClipboardIcon } from './icons/ClipboardIcon.tsx';

interface PromptViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt | null;
  tool: Tool | null;
  category: Category | null;
}

export const PromptViewModal: React.FC<PromptViewModalProps> = ({ isOpen, onClose, prompt, tool, category }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !prompt) return null;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
          <header className="p-6 border-b flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{prompt.title}</h2>
              {tool && <p className="text-sm text-gray-500 mt-1">مرتبط بالأداة: <span className="font-semibold">{tool.name}</span></p>}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">&times;</button>
          </header>
          <main className="p-8 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-gray-700 mb-2">الوصف</h3>
                    <p className="text-gray-600">{prompt.description || "لا يوجد وصف."}</p>
                </div>
                
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">التقييم</h3>
                        <StarRating rating={prompt.personal_rating} />
                    </div>
                     <div>
                        <h3 className="font-semibold text-gray-700 mb-2">التصنيف</h3>
                         {category && <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-2.5 py-1 rounded-full">{category.name}</span>}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-700 mb-2">نص البرومبت</h3>
                    <div className="relative">
                        <pre className="bg-gray-100 text-gray-800 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap break-all" dir="ltr">
                            <code>{prompt.promptText}</code>
                        </pre>
                        <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors" title="نسخ البرومبت">
                            {copied ? (
                                <span className="text-xs text-green-600 px-1">تم النسخ!</span>
                            ) : (
                                <ClipboardIcon className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
          </main>
          <footer className="p-6 bg-gray-50 border-t flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                إغلاق
            </button>
          </footer>
      </div>
    </div>
  );
};
