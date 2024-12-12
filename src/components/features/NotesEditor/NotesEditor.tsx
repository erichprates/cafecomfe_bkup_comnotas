import { useState } from 'react';
import { Save } from 'lucide-react';
import { useNotes } from '../../../hooks/useNotes';
import { GroupedNotesList } from './GroupedNotesList';
import { NotesModal } from './NotesModal';

interface NotesEditorProps {
  devotionalDay: number;
  devotionalTitle: string;
}

export function NotesEditor({ devotionalDay, devotionalTitle }: NotesEditorProps) {
  const { saveNotes, allNotes, isLoading } = useNotes(devotionalDay);
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDevotionalDay, setSelectedDevotionalDay] = useState<number | null>(null);

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Por favor, escreva algo antes de salvar.');
      return;
    }
    
    const success = await saveNotes(content);
    if (success) {
      setContent('');
    }
  };

  const handleOpenModal = (day: number) => {
    setSelectedDevotionalDay(day);
    setShowModal(true);
  };

  if (isLoading) return null;

  // Agrupar notas por devocional
  const groupedNotes = allNotes.reduce((acc, note) => {
    const day = note.devotional_day;
    if (!acc[day]) {
      acc[day] = {
        notes: [],
        title: (note as any).devotionals?.title || 'Devocional',
        day
      };
    }
    acc[day].notes.push(note);
    return acc;
  }, {} as Record<number, { notes: typeof allNotes; title: string; day: number }>);

  return (
    <div className="space-y-6">
      {/* Seção de fazer anotação */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Fazer anotação
          </h3>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Salvar</span>
          </button>
        </div>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-32 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 
                   border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200
                   focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                   focus:border-transparent resize-none"
          placeholder="Escreva sua anotação aqui..."
        />
      </div>

      {/* Lista de anotações agrupadas */}
      {Object.values(groupedNotes).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold p-4 border-b border-gray-200 dark:border-gray-700">
            Minhas anotações
          </h3>
          <div className="space-y-2">
            {Object.values(groupedNotes).map(({ notes, title, day }) => (
              <GroupedNotesList
                key={day}
                notes={notes}
                title={title}
                onOpenModal={() => handleOpenModal(day)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal de notas */}
      {showModal && selectedDevotionalDay && (
        <NotesModal
          notes={groupedNotes[selectedDevotionalDay].notes}
          devotionalTitle={groupedNotes[selectedDevotionalDay].title}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}