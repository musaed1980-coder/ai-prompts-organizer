import React, { useState, useEffect } from 'react';
import { Prompt, Tool, Category } from '../types.ts';

interface PromptFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: Omit<Prompt, 'id'> & { id?: string }) => void;
  promptToEdit: Prompt | null;
  tools: Tool[];
  categories: Category[];
}

export const PromptFormModal: React.FC<PromptFormModalProps> = ({ isOpen, onClose, onSave, promptToEdit, tools, categories }) => {
    const getInitialState = () => ({
        title: '',
        promptText: '',
        description: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        personal_rating: 3,
        toolId: tools.length > 0 ? tools[0].id : '',
    });

    const [formData, setFormData] = useState(getInitialState());

    useEffect(() => {
        if (isOpen) {
            if (promptToEdit) {
                setFormData({
                    title: promptToEdit.title,
                    promptText: promptToEdit.promptText,
                    description: promptToEdit.description,
                    categoryId: promptToEdit.categoryId,
                    personal_rating: promptToEdit.personal_rating,
                    toolId: promptToEdit.toolId,
                });
            } else {
                setFormData(getInitialState());
            }
        }
    }, [promptToEdit, isOpen, tools, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'personal_rating' ? parseInt(value, 10) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.toolId) {
            alert('يجب عليك اختيار أداة لربط البرومبت بها.');
            return;
        }
        if (!formData.categoryId) {
            alert('يجب عليك اختيار تصنيف للبرومبت.');
            return;
        }
        onSave({ ...formData, id: promptToEdit?.id });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <header className="p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">{promptToEdit ? 'تعديل البرومبت' : 'إضافة برومبت جديد'}</h2>
                    </header>
                    <main className="p-8 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="toolId_prompt_modal" className="block text-sm font-medium text-gray-700 mb-1">الأداة المرتبطة</label>
                                <select 
                                    id="toolId_prompt_modal" 
                                    name="toolId" 
                                    value={formData.toolId} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                                    required
                                >
                                    {tools.length === 0 ? (
                                        <option disabled value="">الرجاء إضافة أداة أولاً</option>
                                    ) : (
                                        tools.map(tool => <option key={tool.id} value={tool.id}>{tool.name}</option>)
                                    )}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="title_prompt_modal" className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                                <input id="title_prompt_modal" type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="promptText_prompt_modal" className="block text-sm font-medium text-gray-700 mb-1">نص البرومبت</label>
                                <textarea id="promptText_prompt_modal" name="promptText" value={formData.promptText} onChange={handleChange} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm" dir="ltr" required></textarea>
                            </div>
                            <div>
                                <label htmlFor="description_prompt_modal" className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                                <textarea id="description_prompt_modal" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                                    <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                                        {categories.length === 0 ? (
                                            <option disabled value="">الرجاء إضافة تصنيف أولاً</option>
                                        ) : (
                                            categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="personal_rating_prompt_modal" className="block text-sm font-medium text-gray-700 mb-1">تقييمك: {formData.personal_rating} نجوم</label>
                                    <input id="personal_rating_prompt_modal" type="range" name="personal_rating" min="0" max="5" value={formData.personal_rating} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </main>
                    <footer className="p-6 bg-gray-50 border-t flex justify-end space-x-3 space-x-reverse">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">إلغاء</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-300" disabled={tools.length === 0 || categories.length === 0}>حفظ البرومبت</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};
