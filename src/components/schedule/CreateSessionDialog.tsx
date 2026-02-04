import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { DAYS_OF_WEEK, TIME_SLOTS } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CreateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDay?: string;
  defaultSlot?: number;
  defaultClass?: string;
}

export function CreateSessionDialog({ 
  open, 
  onOpenChange,
  defaultDay = '',
  defaultSlot,
  defaultClass = '',
}: CreateSessionDialogProps) {
  const { createSession, classes } = useApp();
  
  const [day, setDay] = useState(defaultDay);
  const [date, setDate] = useState<Date>(new Date());
  const [timeSlot, setTimeSlot] = useState(defaultSlot !== undefined ? TIME_SLOTS[defaultSlot] : '');
  const [className, setClassName] = useState(defaultClass);

  const handleSubmit = () => {
    if (day && date && timeSlot && className) {
      createSession({
        day,
        date,
        timeSlot,
        className,
      });
      onOpenChange(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setDay('');
    setDate(new Date());
    setTimeSlot('');
    setClassName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display">Créer une séance</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="day">Jour</Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger id="day">
                <SelectValue placeholder="Sélectionner un jour" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : "Choisir une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timeSlot">Créneau horaire</Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger id="timeSlot">
                <SelectValue placeholder="Sélectionner un créneau" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="className">Classe</Label>
            {classes.length > 0 ? (
              <Select value={className} onValueChange={setClassName}>
                <SelectTrigger id="className">
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input 
                id="className"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Ex: 1S1"
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!day || !date || !timeSlot || !className}>
            Créer la séance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
