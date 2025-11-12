import React from 'react';
import { Prompt, Tool, Category } from '../types.ts';
import { StarRating } from './StarRating.tsx';
import { TechIcon } from './icons/TechIcon.tsx';
import { ClipboardIcon } from './icons/ClipboardIcon.tsx';
import { EyeIcon } from './icons/EyeIcon.tsx';

interface PromptCardProps {
  prompt: Prompt;
  tool?: Tool;
  category?: Category;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, tool, category, onEdit, onDelete, onView }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full overflow-hidden border border-gray-200">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 break-words">{prompt.title}</h3>
            {tool && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                    <TechIcon className="w-4 h-4 ml-2" />
                    <span>{tool.name}</span>
                </div>
            )}
          </div>
          <div className="flex-shrink-0 pl-2">
            <StarRating rating={prompt.personal_rating} />
          </div>
        </div>
        <p className="text-gray-600 mb-4 leading-relaxed">{prompt.description}</p>
        <pre className="bg-gray-100 text-gray-800 rounded p-3 text-sm font-mono whitespace-pre-wrap break-words max-h-28 overflow-y-auto" dir="ltr">
            <code>{prompt.promptText}</code>
        </pre>
      </div>
      <div className="bg-gray-50 p-4 flex justify-between items-center border-t">
        <div>
            {category && <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">{category.name}</span>}
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
            <button
                onClick={handleCopy}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
                title="نسخ البرومبت"
            >
                {copied ? <span className="text-xs text-green-600">تم النسخ!</span> : <ClipboardIcon className="w-5 h-5" />}
            </button>
            <button
                onClick={onView}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
                title="عرض البرومبت"
            >
                <EyeIcon className="w-5 h-5" />
            </button>
            <button
                onClick={onEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
            >
                تعديل
            </button>
            <button
                onClick={onDelete}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
            >
                حذف
            </button>
        </div>
      </div>
    </div>
  );
};
