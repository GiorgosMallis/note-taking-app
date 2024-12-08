import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Category, Tag } from '../types';

interface CategoryTagEditorProps {
  item: Category | Tag | null;
  type: 'category' | 'tag';
  onSave: (item: Category | Tag) => void;
  onCancel: () => void;
}

const CategoryTagEditor: React.FC<CategoryTagEditorProps> = ({
  item,
  type,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(item?.name || '');
  const [color, setColor] = useState(item?.color || '#3b82f6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: item?.id || Date.now().toString(),
      name,
      color,
    };
    onSave(newItem);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-light-surface dark:bg-dark-surface rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
          {item ? `Edit ${type}` : `New ${type}`}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-light-text-secondary dark:text-dark-text-secondary text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border border-light-border dark:border-dark-border rounded w-full py-2 px-3 text-light-text-primary dark:text-dark-text-primary bg-light-surface dark:bg-dark-surface leading-tight focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              placeholder={`Enter ${type} name`}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-light-text-secondary dark:text-dark-text-secondary text-sm font-bold mb-2">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="shadow appearance-none border border-light-border dark:border-dark-border rounded flex-1 py-2 px-3 text-light-text-primary dark:text-dark-text-primary bg-light-surface dark:bg-dark-surface leading-tight focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                pattern="^#[0-9A-Fa-f]{6}$"
                placeholder="#000000"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary bg-light-border dark:bg-dark-border rounded-md hover:bg-light-hover dark:hover:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-light-accent dark:bg-dark-accent rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CategoryTagEditor;
