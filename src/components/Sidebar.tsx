import React, { useState } from 'react';
import { Category, Tag } from '../types';
import CategoryTagEditor from './CategoryTagEditor';

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
  onCategorySelect: (categoryId: string | null) => void;
  onTagSelect: (tagId: string | null) => void;
  selectedCategory: string | null;
  selectedTag: string | null;
  onCategoryUpdate: (category: Category) => void;
  onTagUpdate: (tag: Tag) => void;
  t: (key: string) => string;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  tags,
  onCategorySelect,
  onTagSelect,
  selectedCategory,
  selectedTag,
  onCategoryUpdate,
  onTagUpdate,
  t,
}) => {
  const [editingItem, setEditingItem] = useState<{
    item: Category | Tag | null;
    type: 'category' | 'tag';
  } | null>(null);

  const handleEdit = (item: Category | Tag, type: 'category' | 'tag') => {
    setEditingItem({ item, type });
  };

  const handleSave = (item: Category | Tag) => {
    if (editingItem?.type === 'category') {
      onCategoryUpdate(item as Category);
    } else {
      onTagUpdate(item as Tag);
    }
    setEditingItem(null);
  };

  return (
    <>
      <div className="bg-light-surface dark:bg-dark-surface shadow-lg h-screen fixed left-0 top-0 z-30 w-64">
        <div className="p-4 overflow-y-auto h-full">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                {t('Categories')}
              </h2>
              <button
                onClick={() => setEditingItem({ type: 'category', item: null })}
                className="p-1.5 rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light hover:bg-light-accent dark:hover:bg-dark-accent transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => onCategorySelect(null)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === null
                    ? 'bg-primary text-white'
                    : 'text-light-text-primary dark:text-dark-text-primary hover:bg-light-accent dark:hover:bg-dark-accent'
                }`}
              >
                {t('All Categories')}
              </button>
              {categories.map((category) => (
                <div key={category.id} className="group relative">
                  <button
                    onClick={() => onCategorySelect(category.id)}
                    className={`w-full text-left pl-3 pr-12 py-2 rounded-lg transition-colors flex items-center ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'text-light-text-primary dark:text-dark-text-primary hover:bg-light-accent dark:hover:bg-dark-accent'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                      <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                    </svg>
                    <span className="flex-1">{t(category.name)}</span>
                    <div className="w-3 h-3 rounded-full ml-2" style={{ backgroundColor: category.color }} />
                  </button>
                  <button
                    onClick={() => setEditingItem({ type: 'category', item: category })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light hover:bg-light-accent dark:hover:bg-dark-accent"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                {t('Tags')}
              </h2>
              <button
                onClick={() => setEditingItem({ type: 'tag', item: null })}
                className="p-1.5 rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light hover:bg-light-accent dark:hover:bg-dark-accent transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => onTagSelect(null)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedTag === null
                    ? 'bg-primary text-white'
                    : 'text-light-text-primary dark:text-dark-text-primary hover:bg-light-accent dark:hover:bg-dark-accent'
                }`}
              >
                {t('All Tags')}
              </button>
              {tags.map((tag) => (
                <div key={tag.id} className="group relative">
                  <button
                    onClick={() => onTagSelect(tag.id)}
                    className={`w-full text-left pl-3 pr-12 py-2 rounded-lg transition-colors flex items-center ${
                      selectedTag === tag.id
                        ? 'bg-primary text-white'
                        : 'text-light-text-primary dark:text-dark-text-primary hover:bg-light-accent dark:hover:bg-dark-accent'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span className="flex-1">{t(tag.name)}</span>
                    <div className="w-3 h-3 rounded-full ml-2" style={{ backgroundColor: tag.color }} />
                  </button>
                  <button
                    onClick={() => setEditingItem({ type: 'tag', item: tag })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light hover:bg-light-accent dark:hover:bg-dark-accent"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {editingItem && (
        <CategoryTagEditor
          item={editingItem.item}
          type={editingItem.type}
          onSave={handleSave}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </>
  );
};

export default Sidebar;
