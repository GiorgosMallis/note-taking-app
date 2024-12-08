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
  onNewCategory: () => void;
  onNewTag: () => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  onCategoryDelete?: (categoryId: string) => void;
  onTagDelete?: (tagId: string) => void;
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
  onNewCategory,
  onNewTag,
  searchQuery,
  onSearch,
  onCategoryDelete,
  onTagDelete,
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
      <div className="w-64 h-full bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border flex flex-col">
        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-light-accent/50 dark:bg-dark-accent/50 border border-light-border dark:border-dark-border rounded-xl text-light-text-primary dark:text-dark-text-primary placeholder-light-text-muted dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-light-text-muted dark:text-dark-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Categories Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 mb-6">
            <div className="flex items-center justify-between mb-2 px-2">
              <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">Categories</h2>
              <button
                onClick={onNewCategory}
                className="p-1 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent text-light-text-muted dark:text-dark-text-muted transition-colors"
                title="Add category"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => onCategorySelect(null)}
                className={`w-full flex items-center justify-start px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === null
                    ? 'bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary'
                    : 'hover:bg-light-accent/50 dark:hover:bg-dark-accent/50 text-light-text-muted dark:text-dark-text-muted'
                }`}
              >
                <span className="flex-1 text-left">All Categories</span>
              </button>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="group relative"
                >
                  <button
                    onClick={() => onCategorySelect(category.id)}
                    className={`w-full flex items-center justify-start px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary'
                        : 'hover:bg-light-accent/50 dark:hover:bg-dark-accent/50 text-light-text-muted dark:text-dark-text-muted'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: category.color }} />
                    <span className="text-sm truncate flex-1 text-left">{category.name}</span>
                  </button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(category, 'category');
                      }}
                      className="p-1.5 rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light hover:bg-light-accent dark:hover:bg-dark-accent"
                      title="Edit category"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {onCategoryDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
                            onCategoryDelete(category.id);
                          }
                        }}
                        className="p-1.5 rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:text-red-500 dark:hover:text-red-400 hover:bg-light-accent dark:hover:bg-dark-accent"
                        title="Delete category"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div className="px-3">
            <div className="flex items-center justify-between mb-2 px-2">
              <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">Tags</h2>
              <button
                onClick={onNewTag}
                className="p-1 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent text-light-text-muted dark:text-dark-text-muted transition-colors"
                title="Add tag"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => onTagSelect(null)}
                className={`w-full flex items-center justify-start px-3 py-2 rounded-lg transition-colors ${
                  selectedTag === null
                    ? 'bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary'
                    : 'hover:bg-light-accent/50 dark:hover:bg-dark-accent/50 text-light-text-muted dark:text-dark-text-muted'
                }`}
              >
                <span className="flex-1 text-left">All Tags</span>
              </button>
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="group relative"
                >
                  <button
                    onClick={() => onTagSelect(tag.id)}
                    className={`w-full flex items-center justify-start px-3 py-2 rounded-lg transition-colors ${
                      selectedTag === tag.id
                        ? 'bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary'
                        : 'hover:bg-light-accent/50 dark:hover:bg-dark-accent/50 text-light-text-muted dark:text-dark-text-muted'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: tag.color }} />
                    <span className="text-sm truncate flex-1 text-left">{tag.name}</span>
                  </button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(tag, 'tag');
                      }}
                      className="p-1.5 rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light hover:bg-light-accent dark:hover:bg-dark-accent"
                      title="Edit tag"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {onTagDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete the tag "${tag.name}"?`)) {
                            onTagDelete(tag.id);
                          }
                        }}
                        className="p-1.5 rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:text-red-500 dark:hover:text-red-400 hover:bg-light-accent dark:hover:bg-dark-accent"
                        title="Delete tag"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
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
