import React, { useState, useEffect } from 'react';
import NoteEditor from './components/NoteEditor';
import Sidebar from './components/Sidebar';
import { Note, Category, Tag } from './types';
import { storageService } from './services/storage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { translate } from './translations';

const AppContent: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();

  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = storageService.loadNotes();
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
    const savedCategories = storageService.loadCategories();
    return savedCategories.length > 0 ? savedCategories : [
      { id: '1', name: 'Personal', color: '#A69E8F', parentId: null },
      { id: '2', name: 'Work', color: '#8C8579', parentId: null },
      { id: '3', name: 'Ideas', color: '#736D64', parentId: null },
    ];
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    const savedTags = storageService.loadTags();
    return savedTags.length > 0 ? savedTags : [
      { id: '1', name: 'Important', color: '#9E9589' },
      { id: '2', name: 'Todo', color: '#8A8276' },
      { id: '3', name: 'Research', color: '#766F66' },
    ];
  });

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
      title: '',
      content: '',
      categoryId: null,
      tags: [],
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [...prev, newNote]);
    setCurrentNote(newNote);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setCurrentNote(updatedNote);
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

  const handleUpdateNoteTitle = (noteId: string, newTitle: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, title: newTitle, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const filteredNotes = sortedNotes.filter(note => {
    const matchesCategory = !selectedCategory || note.categoryId === selectedCategory;
    const matchesTag = !selectedTag || (note.tags && note.tags.includes(selectedTag));
    const matchesSearch = !searchQuery || (
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.categoryId && getCategoryName(note.categoryId).toLowerCase().includes(searchQuery.toLowerCase())) ||
      note.tags.some(tagId => getTagName(tagId).toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return matchesCategory && matchesTag && matchesSearch;
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

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          categories={categories}
          tags={tags}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          onCategorySelect={setSelectedCategory}
          onTagSelect={setSelectedTag}
          onCategoryUpdate={handleCategoryUpdate}
          onTagUpdate={handleTagUpdate}
          t={t}
        />

        <div className="flex-1 ml-64 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="h-16 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border">
            <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">{t('MallisVault')}</h1>
            <div className="flex-1 mx-4">
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('Search notes...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary"
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
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
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
                onClick={toggleLanguage}
                className="p-2 rounded-lg bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary hover:bg-light-border dark:hover:bg-dark-border transition-colors"
                title={t('Language')}
              >
                {language === 'en' ? '🇬🇧' : '🇬🇷'}
              </button>
              <button
                onClick={handleCreateNote}
                className="px-3 sm:px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
              >
                {t('New Note')}
              </button>
            </div>
          </div>

          {/* Notes Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="group relative cursor-pointer"
                >
                  <div 
                    onClick={() => handleNoteSelect(note)}
                    className="h-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4 hover:border-primary dark:hover:border-primary transition-colors shadow-sm hover:shadow-md"
                  >
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-light-text-primary dark:text-dark-text-primary line-clamp-2">
                      {note.title || t('Untitled Note')}
                    </h3>
                    <p className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary line-clamp-3">
                      {note.content || t('No content')}
                    </p>
                    <p className="mt-2 text-xs text-light-text-muted dark:text-dark-text-muted">
                      {new Date(note.updatedAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </p>
                    <div className="my-3 border-t border-light-border/30 dark:border-dark-border/30" />
                    {note.categoryId && (
                      <div className="mt-3">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded text-xs sm:text-sm font-medium shadow-sm"
                          style={{ 
                            backgroundColor: getCategoryColor(note.categoryId || ''), 
                            color: 'white' 
                          }}
                        >
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                            <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                          </svg>
                          {getCategoryName(note.categoryId || '')}
                        </span>
                      </div>
                    )}
                    {note.tags && note.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {note.tags.map((tagId) => (
                          <span
                            key={tagId}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm border"
                            style={{ 
                              borderColor: getTagColor(tagId),
                              color: getTagColor(tagId),
                              backgroundColor: 'transparent'
                            }}
                          >
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            {getTagName(tagId)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePin(note.id);
                      }}
                      className="p-1.5 rounded-md bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light hover:bg-light-accent dark:hover:bg-dark-accent transition-colors shadow-sm"
                      title={note.isPinned ? t('Unpin') : t('Pin')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={note.isPinned 
                            ? "M5 15l7-7 7 7M5 9l7-7 7 7" 
                            : "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"}
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNoteSelect(note);
                      }}
                      className="p-1.5 rounded-md bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light hover:bg-light-accent dark:hover:bg-dark-accent transition-colors shadow-sm"
                      title={t('Edit')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="p-1.5 rounded-md bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-red-500 hover:bg-light-accent dark:hover:bg-dark-accent transition-colors shadow-sm"
                      title={t('Delete')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
                onSave={(updatedNote) => {
                  const updatedNotes = notes.map((n) =>
                    n.id === updatedNote.id ? updatedNote : n
                  );
                  setNotes(updatedNotes);
                  storageService.saveNotes(updatedNotes);
                  setCurrentNote(null);
                }}
                onClose={() => setCurrentNote(null)}
                t={t}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
