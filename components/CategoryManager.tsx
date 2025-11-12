import React, { useState } from 'react';
import { Category } from '../types.ts';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onUpdateCategory: (id: string, newName: string) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };
  
  const handleStartEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleSaveEdit = (id: string) => {
    if (editingCategoryName.trim()) {
      onUpdateCategory(id, editingCategoryName.trim());
      handleCancelEdit();
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">إدارة التصنيفات</h2>
      
      <form onSubmit={handleAdd} className="flex gap-4 mb-8 pb-8 border-b">
        <input
          type="text"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          placeholder="أضف تصنيفًا جديدًا..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          إضافة
        </button>
      </form>

      <div className="space-y-4">
        {categories.map(category => (
          <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            {editingCategoryId === category.id ? (
              <input 
                type="text"
                value={editingCategoryName}
                onChange={e => setEditingCategoryName(e.target.value)}
                className="px-3 py-1 border border-blue-400 rounded-md focus:outline-none"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(category.id)}
              />
            ) : (
              <span className="font-medium text-gray-700">{category.name}</span>
            )}
            
            <div className="flex items-center space-x-3 space-x-reverse">
              {editingCategoryId === category.id ? (
                <>
                  <button onClick={() => handleSaveEdit(category.id)} className="text-sm text-green-600 hover:underline">حفظ</button>
                  <button onClick={handleCancelEdit} className="text-sm text-gray-600 hover:underline">إلغاء</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleStartEdit(category)} className="text-sm text-blue-600 hover:underline">تعديل</button>
                  <button onClick={() => onDeleteCategory(category.id)} className="text-sm text-red-600 hover:underline">حذف</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
       {categories.length === 0 && (
          <div className="text-center py-10">
              <p className="text-gray-500">لا توجد تصنيفات. ابدأ بإضافة أول تصنيف لك!</p>
          </div>
       )}
    </div>
  );
};
