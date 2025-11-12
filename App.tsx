import React, { useState, useEffect, useMemo } from 'react';
import { Tool, Prompt, Category } from './types';
import { initialTools, initialPrompts, initialCategories } from './data';
import { ToolCard } from './components/ToolCard';
import { PromptCard } from './components/PromptCard';
import { ToolFormModal } from './components/ToolFormModal';
import { PromptFormModal } from './components/PromptFormModal';
import { PromptViewModal } from './components/PromptViewModal';
import { CategoryManager } from './components/CategoryManager';
import { TechIcon } from './components/icons/TechIcon';
import { PromptIcon } from './components/icons/PromptIcon';
import { SolutionsIcon } from './components/icons/SolutionsIcon';
import { ClassificationIcon } from './components/icons/ClassificationIcon';
import { Flowchart } from './components/Flowchart';
import { CodeBlock } from './components/CodeBlock';

// Helper to get data from localStorage
const useStickyState = <T,>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      if (stickyValue !== null) {
          const parsed = JSON.parse(stickyValue);
          // Basic check for initial data structure change
          if (key === 'ai_tools_dashboard_tools' && parsed.length > 0 && parsed[0].main_category) {
             return defaultValue;
          }
          return parsed;
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, value]);
  return [value, setValue];
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('guide');
  const [tools, setTools] = useStickyState<Tool[]>(initialTools, 'ai_tools_dashboard_tools');
  const [prompts, setPrompts] = useStickyState<Prompt[]>(initialPrompts, 'ai_tools_dashboard_prompts');
  const [categories, setCategories] = useStickyState<Category[]>(initialCategories, 'ai_tools_dashboard_categories');
  
  // State for modals
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [toolToEdit, setToolToEdit] = useState<Tool | null>(null);

  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null);

  const [isPromptViewOpen, setIsPromptViewOpen] = useState(false);
  const [viewedPrompt, setViewedPrompt] = useState<Prompt | null>(null);

  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Tool handlers
  const handleOpenAddTool = () => {
    setToolToEdit(null);
    setIsToolModalOpen(true);
  };
  
  const handleOpenEditTool = (tool: Tool) => {
    setToolToEdit(tool);
    setIsToolModalOpen(true);
  };

  const handleSaveTool = (toolData: Omit<Tool, 'id'> & { id?: string }) => {
    if (toolData.id) {
      setTools(tools.map(t => t.id === toolData.id ? { ...t, ...toolData } as Tool : t));
    } else {
      const newTool = { ...toolData, id: `tool_${Date.now()}` } as Tool;
      setTools([...tools, newTool]);
    }
  };

  const handleDeleteTool = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الأداة وكل البرومبتات المرتبطة بها؟')) {
      setTools(tools.filter(t => t.id !== id));
      setPrompts(prompts.filter(p => p.toolId !== id));
    }
  };

  // Prompt handlers
  const handleOpenAddPrompt = () => {
    setPromptToEdit(null);
    setIsPromptModalOpen(true);
  };

  const handleOpenEditPrompt = (prompt: Prompt) => {
    setPromptToEdit(prompt);
    setIsPromptModalOpen(true);
  };

  const handleSavePrompt = (promptData: Omit<Prompt, 'id'> & { id?: string }) => {
    if (promptData.id) {
      setPrompts(prompts.map(p => p.id === promptData.id ? { ...p, ...promptData } as Prompt : p));
    } else {
      const newPrompt = { ...promptData, id: `prompt_${Date.now()}` } as Prompt;
      setPrompts([...prompts, newPrompt]);
    }
  };

  const handleDeletePrompt = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا البرومبت؟')) {
      setPrompts(prompts.filter(p => p.id !== id));
    }
  };
  
  // Category Handlers
  const handleAddCategory = (name: string) => {
    if (name && !categories.some(c => c.name === name)) {
        const newCategory: Category = { id: `cat_${Date.now()}`, name };
        setCategories([...categories, newCategory]);
    }
  };

  const handleUpdateCategory = (id: string, newName: string) => {
      setCategories(categories.map(c => c.id === id ? { ...c, name: newName } : c));
  };
  
  const handleDeleteCategory = (id: string) => {
      if (window.confirm('هل أنت متأكد من حذف هذا التصنيف؟ سيتم إزالته من جميع الأدوات والبرومبتات.')) {
          setCategories(categories.filter(c => c.id !== id));
          // Remove category from tools
          setTools(prevTools => prevTools.map(tool => ({
              ...tool,
              categoryIds: tool.categoryIds.filter(catId => catId !== id)
          })));
          // Reset category for prompts
          setPrompts(prevPrompts => prevPrompts.map(prompt => 
            prompt.categoryId === id ? { ...prompt, categoryId: '' } : prompt
          ));
      }
  };


  // Prompt View handlers
  const handleOpenPromptView = (prompt: Prompt) => {
    setViewedPrompt(prompt);
    setIsPromptViewOpen(true);
  };

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.categoryIds.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [tools, searchTerm, selectedCategory]);

  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      const tool = tools.find(t => t.id === prompt.toolId);
      const toolName = tool ? tool.name.toLowerCase() : '';
      const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) 
        || prompt.promptText.toLowerCase().includes(searchTerm.toLowerCase())
        || toolName.includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || prompt.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [prompts, tools, searchTerm, selectedCategory]);

  const TabButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: React.FC<{className?: string}> }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setSelectedCategory('all');
        setSearchTerm('');
      }}
      className={`flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'tools':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                categories={categories}
                onEdit={() => handleOpenEditTool(tool)}
                onDelete={() => handleDeleteTool(tool.id)}
              />
            ))}
          </div>
        );
      case 'prompts':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map(prompt => {
              const tool = tools.find(t => t.id === prompt.toolId);
              const category = categories.find(c => c.id === prompt.categoryId);
              return (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  tool={tool}
                  category={category}
                  onEdit={() => handleOpenEditPrompt(prompt)}
                  onDelete={() => handleDeletePrompt(prompt.id)}
                  onView={() => handleOpenPromptView(prompt)}
                />
              );
            })}
          </div>
        );
      case 'categories':
        return (
          <CategoryManager
            categories={categories}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      case 'guide':
        return (
          <div className="bg-white p-8 rounded-lg shadow-md prose prose-lg max-w-none text-right" dir="rtl">
            <h2 className="text-3xl font-bold text-center mb-6">مرحباً بك في لوحة تحكم أدوات وبرومبتات الذكاء الاصطناعي</h2>
            <p>
              هذه الأداة مصممة لتكون مستودعك الشخصي لكل أدوات الذكاء الاصطناعي التي تستخدمها وبرومبتاتك المفضلة. يمكنك إضافة، تعديل، حذف، وتقييم أدواتك وبرومبتاتك بكل سهولة.
            </p>
            <h3 className="mt-8">كيف تعمل الأداة؟</h3>
            <p>
                الأداة بسيطة وتتبع التدفق التالي:
            </p>
            <Flowchart />
            <ol>
                <li><strong>إدارة التصنيفات:</strong> ابدأ بإنشاء نظام التصنيف الخاص بك من قسم "التصنيفات".</li>
                <li><strong>إضافة الأدوات:</strong> أضف أدواتك وقم بتعيينها إلى تصنيف واحد أو أكثر.</li>
                <li><strong>إدارة البرومبتات:</strong> أضف برومبتاتك وقم بربطها بالأداة والتصنيف المناسب.</li>
                <li><strong>البحث والتصفية:</strong> استخدم شريط البحث والتصنيفات للعثور بسرعة على ما تحتاجه.</li>
            </ol>
             <h3 className="mt-8">تخزين البيانات</h3>
            <p>
                يتم تخزين جميع بياناتك (الأدوات والبرومبتات والتصنيفات) محليًا في متصفحك باستخدام <code>localStorage</code>. هذا يعني أن بياناتك خاصة بك ولا يتم إرسالها إلى أي خادم.
            </p>
            <CodeBlock language="javascript">
{`// Your data is safe in your browser's local storage.
const tools = localStorage.getItem('ai_tools_dashboard_tools');
const prompts = localStorage.getItem('ai_tools_dashboard_prompts');
const categories = localStorage.getItem('ai_tools_dashboard_categories');`}
            </CodeBlock>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800" dir="rtl">
      {/* Modals */}
      <ToolFormModal
        isOpen={isToolModalOpen}
        onClose={() => setIsToolModalOpen(false)}
        onSave={handleSaveTool}
        toolToEdit={toolToEdit}
        categories={categories}
      />
      <PromptFormModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        onSave={handleSavePrompt}
        promptToEdit={promptToEdit}
        tools={tools}
        categories={categories}
      />
      <PromptViewModal
        isOpen={isPromptViewOpen}
        onClose={() => setIsPromptViewOpen(false)}
        prompt={viewedPrompt}
        tool={tools.find(t => t.id === viewedPrompt?.toolId) || null}
        category={categories.find(c => c.id === viewedPrompt?.categoryId) || null}
      />

      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">لوحة تحكم AI</h1>
                <div className="flex items-center space-x-2 space-x-reverse">
                    <TabButton id="guide" label="الرئيسية" icon={SolutionsIcon} />
                    <TabButton id="tools" label="أدواتي" icon={TechIcon} />
                    <TabButton id="prompts" label="برومبتاتي" icon={PromptIcon} />
                    <TabButton id="categories" label="التصنيفات" icon={ClassificationIcon} />
                </div>
            </div>
            {(activeTab === 'tools' || activeTab === 'prompts') && (
                <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center">
                    <input
                        type="text"
                        placeholder={activeTab === 'tools' ? "ابحث عن أداة..." : "ابحث عن برومبت..."}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="all">كل التصنيفات</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <div className="flex-grow"></div>
                    {activeTab === 'tools' && (
                        <button onClick={handleOpenAddTool} className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center">
                            <span className="text-xl ml-2">+</span> أضف أداة جديدة
                        </button>
                    )}
                    {activeTab === 'prompts' && (
                         <button onClick={handleOpenAddPrompt} className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center">
                            <span className="text-xl ml-2">+</span> أضف برومبت جديد
                        </button>
                    )}
                </div>
            )}
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
