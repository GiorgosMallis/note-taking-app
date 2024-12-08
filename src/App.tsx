import React, { useState, useEffect } from 'react';
import NoteEditor from './components/NoteEditor';
import Sidebar from './components/Sidebar';
import { NotesPreview } from './components/NotesPreview';
import { Note } from './types/Note';
import { Category } from './types/Category';
import { Tag } from './types/Tag';
import { storageService } from './services/storage';

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = storageService.getNotes();
    return savedNotes || [];
  });
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = storageService.getCategories();
    return savedCategories.length > 0 ? savedCategories : [
      { id: '1', name: 'Personal', color: '#A69E8F', parentId: null },
      { id: '2', name: 'Work', color: '#8C8579', parentId: null },
      { id: '3', name: 'Ideas', color: '#B3A89A', parentId: null },
    ];
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    const savedTags = storageService.getTags();
    return savedTags.length > 0 ? savedTags : [
      { id: '1', name: 'Important', color: '#9E9589' },
      { id: '2', name: 'Todo', color: '#8A8276' },
      { id: '3', name: 'In Progress', color: '#766F65' },
    ];
  });

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    storageService.saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    storageService.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    storageService.saveTags(tags);
  }, [tags]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkTheme);
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  };

  const getTagColor = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    return tag ? tag.color : '';
  };

  const getTagName = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    return tag ? tag.name : '';
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      categoryId: selectedCategory,
      tags: [],
      isPinned: false
    };
    setNotes(prev => [...prev, newNote]);
    setCurrentNote(newNote);
    storageService.saveNotes([...notes, newNote]);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setCurrentNote(updatedNote);
  };

  const handleUpdateTitle = (noteId: string, newTitle: string) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId ? { ...note, title: newTitle } : note
    ));
    setCurrentNote(prev => prev && prev.id === noteId ? { ...prev, title: newTitle } : prev);
    storageService.saveNotes(notes);
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
      if (currentNote?.id === noteId) {
        setCurrentNote(null);
      }
    }
  };

  const handleTogglePin = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const handleReorderNotes = (reorderedNotes: Note[]) => {
    setNotes(reorderedNotes);
    localStorage.setItem('notes', JSON.stringify(reorderedNotes));
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || note.categoryId === selectedCategory;
    const matchesTag = !selectedTag || (note.tags && note.tags.includes(selectedTag));
    return matchesSearch && matchesCategory && matchesTag;
  });

  const handleNoteSelect = (note: Note) => {
    setCurrentNote(note);
  };

  const handleCategoryUpdate = (category: Category) => {
    setCategories(prev => {
      const index = prev.findIndex(c => c.id === category.id);
      if (index >= 0) {
        return [...prev.slice(0, index), category, ...prev.slice(index + 1)];
      }
      return [...prev, category];
    });
  };

  const handleTagUpdate = (tag: Tag) => {
    setTags(prev => {
      const index = prev.findIndex(t => t.id === tag.id);
      if (index >= 0) {
        return [...prev.slice(0, index), tag, ...prev.slice(index + 1)];
      }
      return [...prev, tag];
    });
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleNewCategory = () => {
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: 'New Category',
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      parentId: null
    };
    setCategories([...categories, newCategory]);
  };

  const handleNewTag = () => {
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: 'New Tag',
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    setTags([...tags, newTag]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Remove the category from the categories list
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    
    // Update notes that had this category
    setNotes(prev => prev.map(note => 
      note.categoryId === categoryId 
        ? { ...note, categoryId: null }
        : note
    ));

    // If this was the selected category, clear the selection
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    }
  };

  const handleDeleteTag = (tagId: string) => {
    // Remove the tag from the tags list
    setTags(prev => prev.filter(t => t.id !== tagId));
    
    // Remove this tag from all notes that had it
    setNotes(prev => prev.map(note => ({
      ...note,
      tags: note.tags?.filter(t => t !== tagId) || []
    })));

    // If this was the selected tag, clear the selection
    if (selectedTag === tagId) {
      setSelectedTag(null);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="flex h-screen bg-light-background dark:bg-dark-background">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 fixed h-full">
          <Sidebar
            categories={categories}
            tags={tags}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            onCategorySelect={setSelectedCategory}
            onTagSelect={setSelectedTag}
            onCategoryUpdate={handleCategoryUpdate}
            onTagUpdate={handleTagUpdate}
            onNewCategory={handleNewCategory}
            onNewTag={handleNewTag}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            onCategoryDelete={handleDeleteCategory}
            onTagDelete={handleDeleteTag}
          />
        </div>

        {/* Main content */}
        <div className="ml-64 flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar */}
          <div className="h-16 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border w-full">
            <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary truncate">Notes</h1>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                className="p-2 rounded-lg bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary hover:bg-light-border dark:hover:bg-dark-border transition-colors"
              >
                {isDarkTheme ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleCreateNote}
                className="px-3 sm:px-4 py-2 bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary rounded-lg hover:opacity-90 transition-opacity"
              >
                New Note
              </button>
            </div>
          </div>

          {/* Notes Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <NotesPreview
              notes={filteredNotes}
              categories={categories}
              tags={tags}
              onNoteSelect={handleNoteSelect}
              onDeleteNote={handleDeleteNote}
              onTogglePin={handleTogglePin}
              onCategorySelect={(categoryId: string) => setSelectedCategory(categoryId)}
              onTagSelect={(tagId: string) => setSelectedTag(tagId)}
              onReorder={handleReorderNotes}
            />
          </div>
        </div>

        {/* Note Editor Modal */}
        {currentNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
            <div className="absolute inset-2 sm:inset-4 md:inset-8 bg-light-surface dark:bg-dark-surface rounded-lg shadow-xl z-50 overflow-hidden">
              <NoteEditor
                note={currentNote}
                categories={categories}
                tags={tags}
                onUpdateNote={handleUpdateNote}
                onUpdateTitle={handleUpdateTitle}
                onSave={() => {
                  storageService.saveNotes(notes);
                  setCurrentNote(null);  // Return to main page after saving
                }}
                onClose={() => setCurrentNote(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
