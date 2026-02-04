import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, AlertTriangle, BarChart3 } from 'lucide-react';
import { GestionTab } from '@/components/tabs/GestionTab';
import { SanctionsTab } from '@/components/tabs/SanctionsTab';
import { StatistiquesTab } from '@/components/tabs/StatistiquesTab';
import { SanctionCardOverlay } from '@/components/sanctions/SanctionCardOverlay';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">GC</span>
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-foreground">Gestion de Classe</h1>
                <p className="text-xs text-muted-foreground">Sanctions & Rachats</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="gestion" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="gestion" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Gestion</span>
            </TabsTrigger>
            <TabsTrigger value="sanctions" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Sanctions</span>
            </TabsTrigger>
            <TabsTrigger value="statistiques" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Statistiques</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gestion" className="animate-fade-in">
            <GestionTab />
          </TabsContent>
          
          <TabsContent value="sanctions" className="animate-fade-in">
            <SanctionsTab />
          </TabsContent>
          
          <TabsContent value="statistiques" className="animate-fade-in">
            <StatistiquesTab />
          </TabsContent>
        </Tabs>
      </main>

      <SanctionCardOverlay />
    </div>
  );
}
