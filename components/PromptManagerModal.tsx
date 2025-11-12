

import React, { useState, useEffect } from 'react';
// Fix: Add .ts extension to import types
import { Tool, Prompt } from '../types.ts';
// Fix: Add .ts extension to import constants
import { CATEGORIES } from '../constants.ts';
// Fix: Add .tsx extension to import StarRating component
import { StarRating } from './StarRating.tsx';
// Fix: Add .tsx extension to import PromptIcon component
import { PromptIcon } from './icons/PromptIcon.tsx';

interface PromptManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool | null;
  prompts: Prompt[];
  onSavePrompt: (prompt: Omit<Prompt, 'id'> & { id?: string }) => void;
  onDeletePrompt: (id: string) => void;
}

const PromptForm: React.FC<{
    promptToEdit: (Omit<Prompt, 'id'> & { id?: string }) | null, 
    toolId: string, 
    onSave: (prompt: Omit<Prompt, 'id'> & { id?: string }) => void,
    onCancel: () => void
}> = ({ promptToEdit, toolId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        promptText: '',
        description: '',
        // Fix: Changed 'category' to 'categoryId' to match the Prompt type.
        categoryId: CATEGORIES[0],
        personal_rating: 3,
    });

    useEffect(() => {
        if (promptToEdit) {
            setFormData({
                title: promptToEdit.title,
                promptText: promptToEdit.promptText,
                description: promptToEdit.description,
                // Fix: Use 'categoryId' which exists on the Prompt type, instead of 'category'.
                categoryId: promptToEdit.categoryId,
                personal_rating: promptToEdit.personal_rating,
            });
        } else {
            setFormData({
                title: '',
                promptText: '',
                description: '',
                // Fix: Changed 'category' to 'categoryId' to match the Prompt type.
                categoryId: CATEGORIES[0],
                personal_rating: 3,
            });
        }
    }, [promptToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'personal_rating' ? parseInt(value, 10) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Fix: formData now includes 'categoryId', which aligns with the expected type for onSave.
        onSave({ ...formData, toolId, id: promptToEdit ? (promptToEdit as Prompt).id : undefined });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-8 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6">{promptToEdit ? 'تعديل البرومبت' : 'إضافة برومبت جديد'}</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title_prompt" className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                        <input id="title_prompt" type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="promptText_prompt" className="block text-sm font-medium text-gray-700 mb-1">نص البرومبت</label>
                        <textarea id="promptText_prompt" name="promptText" value={formData.promptText} onChange={handleChange} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm" dir="ltr" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="description_prompt" className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                        <textarea id="description_prompt" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category_prompt" className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                            {/* Fix: Updated name and value to use 'categoryId'. */}
                            <select id="category_prompt" name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="personal_rating_prompt_form" className="block text-sm font-medium text-gray-700 mb-1">تقييمك: {formData.personal_rating} نجوم</label>
                            <input id="personal_rating_prompt_form" type="range" name="personal_rating" min="0" max="5" value={formData.personal_rating} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>
                    </div>
                </div>
                 <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">إلغاء</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">حفظ البرومبت</button>
                </div>
            </div>
        </form>
    );
};

export const PromptManagerModal: React.FC<PromptManagerModalProps> = ({ isOpen, onClose, tool, prompts, onSavePrompt, onDeletePrompt }) => {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editingPrompt, setEditingPrompt] = useState<(Omit<Prompt, 'id'> & { id?: string }) | null>(null);

    useEffect(() => {
        if (isOpen) {
            setView('list');
            setEditingPrompt(null);
        }
    }, [isOpen]);

    const handleAddNew = () => {
        setEditingPrompt(null);
        setView('form');
    };

    const handleEdit = (prompt: Prompt) => {
        setEditingPrompt(prompt);
        setView('form');
    };

    const handleSave = (promptData: Omit<Prompt, 'id'> & { id?: string }) => {
        onSavePrompt(promptData);
        setView('list');
        setEditingPrompt(null);
    };

    if (!isOpen || !tool) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 pt-16" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">إدارة البرومبتات لـ <span className="text-blue-600">{tool.name}</span></h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">&times;</button>
                </header>

                <main className="p-8 overflow-y-auto">
                    {view === 'list' && (
                        <div>
                            <div className="flex justify-end mb-6">
                                <button onClick={handleAddNew} className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center">
                                    <span className="text-xl mr-2">+</span> أضف برومبت جديد
                                </button>
                            </div>
                            {prompts.length > 0 ? (
                                <div className="space-y-4">
                                    {prompts.map(p => (
                                        <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-4 transition-shadow hover:shadow-md">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg text-gray-800">{p.title}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">{p.description}</p>
                                                </div>
                                                <div className="flex items-center space-x-4 space-x-reverse flex-shrink-0 ml-4">
                                                    <StarRating rating={p.personal_rating} />
                                                    <div className="flex space-x-2 space-x-reverse">
                                                        <button onClick={() => handleEdit(p)} className="text-sm text-blue-600 hover:underline">تعديل</button>
                                                        <button onClick={() => onDeletePrompt(p.id)} className="text-sm text-red-600 hover:underline">حذف</button>
                                                    </div>
                                                </div>
                                            </div>
                                             <pre className="mt-3 bg-gray-100 text-gray-800 rounded p-3 text-sm font-mono whitespace-pre-wrap break-all" dir="ltr"><code>{p.promptText}</code></pre>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <PromptIcon className="w-12 h-12 mx-auto text-gray-400" />
                                    <h3 className="mt-2 text-xl font-semibold text-gray-700">لا توجد برومبتات لهذه الأداة</h3>
                                    <p className="mt-1 text-gray-500">ابدأ بإضافة أول برومبت لك!</p>
                                </div>
                            )}
                        </div>
                    )}
                    {view === 'form' && (
                        <PromptForm 
                            promptToEdit={editingPrompt} 
                            toolId={tool.id} 
                            onSave={handleSave} 
                            onCancel={() => setView('list')} 
                        />
                    )}
                </main>
            </div>
        </div>
    );
};