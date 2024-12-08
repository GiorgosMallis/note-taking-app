import React, { useEffect, useRef, useState } from 'react';
import { Note } from '../types/Note';
import { Category } from '../types/Category';
import { Tag } from '../types/Tag';
import html2pdf from 'html2pdf.js';

interface NoteViewModalProps {
  note: Note;
  onClose: () => void;
  onEdit: (note: Note) => void;
  categories?: Category[];
  tags?: Tag[];
}

export const NoteViewModal: React.FC<NoteViewModalProps> = ({
  note,
  onClose,
  onEdit,
  categories = [],
  tags = [],
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleExportPDF = async () => {
    if (!contentRef.current) return;

    // Create a clone of the content for PDF export
    const element = contentRef.current.cloneNode(true) as HTMLElement;
    
    // Apply specific styles for PDF export
    const style = document.createElement('style');
    style.textContent = `
      * {
        font-family: Arial, sans-serif !important;
        line-height: 1.6 !important;
      }
      li {
        margin-bottom: 8px !important;
        page-break-inside: avoid !important;
      }
      ul, ol {
        padding-left: 20px !important;
        margin: 16px 0 !important;
      }
    `;
    element.prepend(style);

    const opt = {
      margin: 0.75,
      filename: `${note.title}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 3,
        letterRendering: true,
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait',
        compress: true
      }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handlePrint = () => {
    if (!contentRef.current) return;

    const printContent = contentRef.current.cloneNode(true) as HTMLElement;
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        * {
          font-family: Arial, sans-serif !important;
          line-height: 1.6 !important;
        }
        li {
          margin-bottom: 8px !important;
          page-break-inside: avoid !important;
        }
        ul, ol {
          padding-left: 20px !important;
          margin: 16px 0 !important;
        }
        body {
          padding: 20px;
        }
        @page {
          margin: 0.75in;
        }
      }
    `;
    printContent.prepend(style);

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>' + note.title + '</title></head><body>');
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleShare = async () => {
    if (!contentRef.current) return;

    try {
      const content = contentRef.current.innerText;
      const shareText = `${note.title}\n\n${content}`;

      if (navigator.share) {
        await navigator.share({
          title: note.title,
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing note:', error);
    }
  };

  if (!note) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const getTagNames = (tagIds: string[]) => {
    return tagIds.map(tagId => {
      const tag = tags.find(t => t.id === tagId);
      return tag ? tag.name : tagId;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {showShareToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary px-4 py-2 rounded-lg shadow-lg z-50">
          Note copied to clipboard!
        </div>
      )}
      <div className="bg-light-surface dark:bg-dark-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="sticky top-0 bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold truncate max-w-[80%] text-light-text-primary dark:text-dark-text-primary">{note.title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors text-light-text-primary dark:text-dark-text-primary"
              aria-label="Share note"
              title="Share note"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors text-light-text-primary dark:text-dark-text-primary"
              aria-label="Print note"
              title="Print note"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
            <button
              onClick={handleExportPDF}
              className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors text-light-text-primary dark:text-dark-text-primary"
              aria-label="Export to PDF"
              title="Export to PDF"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 text-light-text-primary dark:text-dark-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6" ref={contentRef}>
          <div className="space-y-4">
            <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: note.content }} />
            </div>

            <div className="border-t border-light-border dark:border-dark-border pt-4 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <div className="flex items-center gap-2">
                  <span>Created: {formatDate(note.createdAt)}</span>
                  {note.updatedAt && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span>Updated: {formatDate(note.updatedAt)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {note.categoryId && (
                  <div className="flex items-center text-sm">
                    <span className="mr-2 text-light-text-secondary dark:text-dark-text-secondary">Category:</span>
                    <span
                      className="px-2 py-1 rounded-full text-white text-xs"
                      style={{ backgroundColor: categories.find(c => c.id === note.categoryId)?.color || '#3b82f6' }}
                    >
                      {getCategoryName(note.categoryId)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">Tags:</span>
                    {note.tags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag ? (
                        <span
                          key={tagId}
                          className="px-2 py-1 rounded-full text-white text-xs"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteViewModal;
