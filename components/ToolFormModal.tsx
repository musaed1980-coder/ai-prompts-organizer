import React, { useState, useEffect } from 'react';
import { Tool, Category } from '../types.ts';

interface ToolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tool: Omit<Tool, 'id'> & { id?: string }) => void;
  toolToEdit: Tool | null;
  categories: Category[];
}

export const ToolFormModal: React.FC<ToolFormModalProps> = ({ isOpen, onClose, onSave, toolToEdit, categories }) => {
  const initialFormState = {
    name: '',
    url: '',
    description: '',
    categoryIds: [] as string[],
    personal_rating: 3,
    tags: [] as string[],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (isOpen) {
        if (toolToEdit) {
            setFormData({
                name: toolToEdit.name,
                url: toolToEdit.url,
                description: toolToEdit.description,
                categoryIds: toolToEdit.categoryIds,
                personal_rating: toolToEdit.personal_rating,
                tags: toolToEdit.tags,
            });
            setTagsInput(toolToEdit.tags.join(', '));
        } else {
            setFormData(initialFormState);
            setTagsInput('');
        }
    }
  }, [toolToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'personal_rating' ? parseInt(value, 10) : value }));
  };
  
  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => {
        const newCategoryIds = prev.categoryIds.includes(categoryId)
            ? prev.categoryIds.filter(id => id !== categoryId)
            : [...prev.categoryIds, categoryId];
        return { ...prev, categoryIds: newCategoryIds };
    });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    onSave({ ...formData, tags, id: toolToEdit?.id });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <header className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">{toolToEdit ? 'تعديل الأداة' : 'إضافة أداة جديدة'}</h2>
          </header>
          <main className="p-8 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">اسم الأداة</label>
                <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">رابط URL</label>
                <input id="url" type="url" name="url" value={formData.url} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" dir="ltr" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التصنيفات</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                    {categories.map(cat => (
                        <label key={cat.id} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.categoryIds.includes(cat.id)}
                                onChange={() => handleCategoryChange(cat.id)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{cat.name}</span>
                        </label>
                    ))}
                </div>
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">الوسوم (مفصولة بفاصلة)</label>
                <input id="tags" type="text" name="tags" value={tagsInput} onChange={handleTagsChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="personal_rating_tool_form" className="block text-sm font-medium text-gray-700 mb-1">تقييمك: {formData.personal_rating} نجوم</label>
                <input id="personal_rating_tool_form" type="range" name="personal_rating" min="0" max="5" value={formData.personal_rating} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>
          </main>
          <footer className="p-6 bg-gray-50 border-t flex justify-end space-x-3 space-x-reverse">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">إلغاء</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">حفظ الأداة</button>
          </footer>
        </form>
      </div>
    </div>
  );
};
