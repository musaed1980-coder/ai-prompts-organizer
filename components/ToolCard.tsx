import React from 'react';
import { Tool, Category } from '../types.ts';
import { StarRating } from './StarRating.tsx';
import { TechIcon } from './icons/TechIcon.tsx';

interface ToolCardProps {
  tool: Tool;
  categories: Category[];
  onEdit: () => void;
  onDelete: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, categories, onEdit, onDelete }) => {
  const toolCategories = tool.categoryIds.map(id => categories.find(c => c.id === id)).filter(Boolean) as Category[];

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full overflow-hidden border border-gray-200">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                <TechIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="min-w-0">
                <h3 className="text-xl font-bold text-gray-800 break-words">{tool.name}</h3>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all" dir="ltr">{tool.url}</a>
            </div>
          </div>
          <StarRating rating={tool.personal_rating} />
        </div>
        <p className="text-gray-600 mb-4 leading-relaxed">{tool.description}</p>
        <div className="flex flex-wrap gap-2">
            {toolCategories.map(cat => (
              <span key={cat.id} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">{cat.name}</span>
            ))}
            {tool.tags.map(tag => (
                 <span key={tag} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
            ))}
        </div>
      </div>
      <div className="bg-gray-50 p-4 flex justify-end items-center border-t">
        <div className="space-x-3 space-x-reverse flex items-center">
            <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            تعديل
            </button>
            <button
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
            حذف
            </button>
        </div>
      </div>
    </div>
  );
};
