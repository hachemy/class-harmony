import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function SanctionCardOverlay() {
  const { activeSanctionCards, removeActiveSanctionCard, minimizeSanctionCard, getSanctionsByStudent } = useApp();
  const [displayingCards, setDisplayingCards] = useState<string[]>([]);

  useEffect(() => {
    activeSanctionCards.forEach((card) => {
      if (!card.isMinimized && !displayingCards.includes(card.student.id)) {
        setDisplayingCards((prev) => [...prev, card.student.id]);
        
        // Auto minimize after 4 seconds
        setTimeout(() => {
          minimizeSanctionCard(card.student.id);
          setDisplayingCards((prev) => prev.filter((id) => id !== card.student.id));
        }, 4000);
      }
    });
  }, [activeSanctionCards, minimizeSanctionCard, displayingCards]);

  const getSanctionColor = (level: string) => {
    switch (level) {
      case 'yellow': return 'bg-warning-yellow text-black';
      case 'orange': return 'bg-warning-orange text-white';
      case 'red': return 'bg-warning-red text-white';
      case 'black': return 'bg-warning-black text-white';
      default: return 'bg-warning-yellow text-black';
    }
  };

  const fullDisplayCards = activeSanctionCards.filter(
    (card) => !card.isMinimized && displayingCards.includes(card.student.id)
  );

  const minimizedCards = activeSanctionCards.filter((card) => card.isMinimized);

  return (
    <>
      {/* Full Display Cards (Center) */}
      <AnimatePresence>
        {fullDisplayCards.map((card) => (
          <motion.div
            key={`full-${card.student.id}`}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div
              className={`${getSanctionColor(card.sanction.level)} rounded-2xl p-8 shadow-2xl pointer-events-auto max-w-md`}
            >
              <div className="text-center">
                <div className="text-6xl font-display font-bold mb-4">
                  {card.student.firstName[0]}{card.student.lastName[0]}
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">
                  {card.student.firstName} {card.student.lastName}
                </h2>
                <p className="text-lg opacity-90 mb-4">
                  {card.student.className} • ID: {card.student.id}
                </p>
                <div className="border-t border-current/20 pt-4">
                  <p className="text-sm font-medium uppercase tracking-wide opacity-75">
                    Motif
                  </p>
                  <p className="text-lg">{card.sanction.reason}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Minimized Cards (Top Right) */}
      <div className="fixed top-20 right-4 z-40 space-y-2">
        <AnimatePresence>
          {minimizedCards.map((card) => {
            const studentSanctions = getSanctionsByStudent(card.student.id);
            
            return (
              <Tooltip key={`min-${card.student.id}`}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className={`${getSanctionColor(card.sanction.level)} rounded-lg p-3 shadow-lg cursor-pointer flex items-center gap-3 min-w-[200px]`}
                  >
                    <div className="font-bold text-lg">
                      {card.student.firstName[0]}{card.student.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {card.student.firstName} {card.student.lastName}
                      </p>
                      <p className="text-xs opacity-75">
                        {card.student.id}
                      </p>
                    </div>
                    <button
                      onClick={() => removeActiveSanctionCard(card.student.id)}
                      className="opacity-75 hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[300px]">
                  <div className="space-y-2">
                    <p className="font-medium">Historique des sanctions</p>
                    {studentSanctions.slice(0, 5).map((s, i) => (
                      <div key={i} className="text-xs">
                        <span className="text-muted-foreground">
                          {new Date(s.date).toLocaleDateString('fr-FR')} {s.time}
                        </span>
                        <br />
                        {s.reason}
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}
