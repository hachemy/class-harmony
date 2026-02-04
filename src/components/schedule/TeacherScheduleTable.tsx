import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DAYS_OF_WEEK, TIME_SLOTS } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function TeacherScheduleTable() {
  const { schedule, updateCell, classes } = useApp();
  const [selectedCell, setSelectedCell] = useState<{ day: string; slot: number } | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [cellData, setCellData] = useState({ className: '', room: '' });

  const handleCellClick = (day: string, slot: number) => {
    const cell = schedule[day]?.[slot];
    if (cell?.mergedWith) return;
    
    setSelectedCell({ day, slot });
    setCellData({
      className: cell?.className || '',
      room: cell?.room || '',
    });
    setEditDialog(true);
  };

  const handleSave = () => {
    if (selectedCell && (cellData.className || cellData.room)) {
      updateCell(selectedCell.day, selectedCell.slot, {
        id: `${selectedCell.day}-${selectedCell.slot}`,
        className: cellData.className,
        room: cellData.room,
      });
    } else if (selectedCell) {
      updateCell(selectedCell.day, selectedCell.slot, null);
    }
    setEditDialog(false);
    setSelectedCell(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border bg-muted/50 p-2 font-medium text-muted-foreground min-w-[80px]">
                Jour
              </th>
              {TIME_SLOTS.map((slot, index) => (
                <th 
                  key={index} 
                  className="border bg-muted/50 p-2 font-medium text-muted-foreground min-w-[100px] text-xs"
                >
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS_OF_WEEK.map((day) => (
              <tr key={day}>
                <td className="border bg-muted/30 p-2 font-medium text-sm">
                  {day}
                </td>
                {TIME_SLOTS.map((_, slotIndex) => {
                  const cell = schedule[day]?.[slotIndex];
                  
                  if (cell?.mergedWith) return null;

                  return (
                    <td
                      key={slotIndex}
                      colSpan={cell?.colspan || 1}
                      onClick={() => handleCellClick(day, slotIndex)}
                      className={cn(
                        "border p-2 cursor-pointer transition-colors hover:bg-primary/5 min-h-[60px]",
                        cell?.className && "bg-primary/10"
                      )}
                    >
                      {cell && (
                        <div className="text-center">
                          <div className="font-medium text-primary text-xs">{cell.className}</div>
                          {cell.room && (
                            <div className="text-xs text-muted-foreground">{cell.room}</div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle className="font-display">
              {selectedCell ? `${selectedCell.day} - ${TIME_SLOTS[selectedCell.slot]}` : 'Modifier cellule'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cellClassName">Classe</Label>
              {classes.length > 0 ? (
                <select
                  id="cellClassName"
                  value={cellData.className}
                  onChange={(e) => setCellData(prev => ({ ...prev, className: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              ) : (
                <Input 
                  id="cellClassName"
                  value={cellData.className}
                  onChange={(e) => setCellData(prev => ({ ...prev, className: e.target.value }))}
                  placeholder="Ex: 1S1"
                />
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="room">Salle</Label>
              <Input 
                id="room"
                value={cellData.room}
                onChange={(e) => setCellData(prev => ({ ...prev, room: e.target.value }))}
                placeholder="Ex: A204"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
