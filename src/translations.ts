interface Translations {
  [key: string]: {
    en: string;
    gr: string;
  };
}

export const translations: Translations = {
  // Sidebar
  'New Note': { en: 'New Note', gr: 'Νέα Σημείωση' },
  'Categories': { en: 'Categories', gr: 'Κατηγορίες' },
  'Tags': { en: 'Tags', gr: 'Ετικέτες' },
  'Personal': { en: 'Personal', gr: 'Προσωπικά' },
  'Work': { en: 'Work', gr: 'Εργασία' },
  'Ideas': { en: 'Ideas', gr: 'Ιδέες' },
  'Important': { en: 'Important', gr: 'Σημαντικό' },
  'Todo': { en: 'Todo', gr: 'Εκκρεμότητες' },
  'Research': { en: 'Research', gr: 'Έρευνα' },

  // Note Actions
  'Pin note': { en: 'Pin note', gr: 'Καρφίτσωμα' },
  'Unpin note': { en: 'Unpin note', gr: 'Ξεκαρφίτσωμα' },
  'Edit': { en: 'Edit', gr: 'Επεξεργασία' },
  'Delete': { en: 'Delete', gr: 'Διαγραφή' },
  'Save': { en: 'Save', gr: 'Αποθήκευση' },
  'Cancel': { en: 'Cancel', gr: 'Ακύρωση' },

  // Editor Toolbar
  'Bold': { en: 'Bold', gr: 'Έντονα' },
  'Italic': { en: 'Italic', gr: 'Πλάγια' },
  'Strikethrough': { en: 'Strikethrough', gr: 'Διαγραμμένο' },
  'Bullet List': { en: 'Bullet List', gr: 'Λίστα με Κουκκίδες' },
  'Numbered List': { en: 'Numbered List', gr: 'Αριθμημένη Λίστα' },
  'Task List': { en: 'Task List', gr: 'Λίστα Εργασιών' },
  'Quote': { en: 'Quote', gr: 'Παράθεση' },
  'Code Block': { en: 'Code Block', gr: 'Μπλοκ Κώδικα' },
  'Insert Image': { en: 'Insert Image', gr: 'Εισαγωγή Εικόνας' },

  // Misc
  'Last updated': { en: 'Last updated', gr: 'Τελευταία ενημέρωση' },
  'Untitled Note': { en: 'Untitled Note', gr: 'Σημείωση χωρίς τίτλο' },
  'Search notes...': { en: 'Search notes...', gr: 'Αναζήτηση σημειώσεων...' },
  'Language': { en: 'Language', gr: 'Γλώσσα' },
};

export type Language = 'en' | 'gr';

export const translate = (key: string, language: Language): string => {
  const translation = translations[key];
  if (!translation) return key;
  return translation[language];
};
