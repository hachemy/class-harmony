import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, AlertTriangle, Heart, TrendingUp } from 'lucide-react';

const COLORS = {
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  red: '#ef4444',
  black: '#262626',
};

export function StatistiquesTab() {
  const { students, sanctions, rachats, classes, sanctionsByLevel } = useApp();
  const [selectedClass, setSelectedClass] = useState<string>('all');

  const filteredStudents = useMemo(() => {
    if (selectedClass === 'all') return students;
    return students.filter(s => s.className === selectedClass);
  }, [students, selectedClass]);

  const stats = useMemo(() => {
    const total = filteredStudents.length;
    const withSanctions = filteredStudents.filter(s => s.sanctionCount > 0).length;
    const withoutSanctions = total - withSanctions;
    
    return {
      total,
      withSanctions,
      withoutSanctions,
      percentClean: total > 0 ? Math.round((withoutSanctions / total) * 100) : 0,
    };
  }, [filteredStudents]);

  const sanctionDistribution = useMemo(() => {
    const distribution = {
      green: filteredStudents.filter(s => s.sanctionLevel === 'none').length,
      yellow: filteredStudents.filter(s => s.sanctionLevel === 'yellow').length,
      orange: filteredStudents.filter(s => s.sanctionLevel === 'orange').length,
      red: filteredStudents.filter(s => s.sanctionLevel === 'red').length,
      black: filteredStudents.filter(s => s.sanctionLevel === 'black').length,
    };
    
    return [
      { name: 'Aucune sanction', value: distribution.green, color: COLORS.green },
      { name: '1 sanction', value: distribution.yellow, color: COLORS.yellow },
      { name: '2 sanctions', value: distribution.orange, color: COLORS.orange },
      { name: '3 sanctions', value: distribution.red, color: COLORS.red },
      { name: '4+ sanctions', value: distribution.black, color: COLORS.black },
    ].filter(item => item.value > 0);
  }, [filteredStudents]);

  const topSanctioned = useMemo(() => {
    return [...filteredStudents]
      .sort((a, b) => b.sanctionCount - a.sanctionCount)
      .slice(0, 5)
      .map(s => ({
        name: `${s.firstName} ${s.lastName[0]}.`,
        sanctions: s.sanctionCount,
        level: s.sanctionLevel,
      }));
  }, [filteredStudents]);

  return (
    <div className="space-y-6">
      {/* Class Filter */}
      <div className="flex justify-end">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Toutes les classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les classes</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Élèves</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{stats.percentClean}%</p>
                <p className="text-sm text-muted-foreground">Sans sanction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{sanctions.length}</p>
                <p className="text-sm text-muted-foreground">Sanctions totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{rachats.length}</p>
                <p className="text-sm text-muted-foreground">Rachats</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-display">Répartition par niveau</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sanctionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sanctionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-display">Top 5 - Plus sanctionnés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSanctioned} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="sanctions" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List by Level */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display">Élèves par niveau de sanction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {(['none', 'yellow', 'orange', 'red', 'black'] as const).map((level) => {
              const levelStudents = filteredStudents.filter(s => s.sanctionLevel === level);
              const levelConfig = {
                none: { label: 'Aucune', color: 'bg-success', textColor: 'text-success-foreground' },
                yellow: { label: '1 sanction', color: 'bg-warning-yellow', textColor: 'text-black' },
                orange: { label: '2 sanctions', color: 'bg-warning-orange', textColor: 'text-white' },
                red: { label: '3 sanctions', color: 'bg-warning-red', textColor: 'text-white' },
                black: { label: '4+ sanctions', color: 'bg-warning-black', textColor: 'text-white' },
              };
              const config = levelConfig[level];
              
              return (
                <div key={level} className="space-y-2">
                  <div className={`${config.color} ${config.textColor} rounded-lg px-3 py-2 text-center font-medium text-sm`}>
                    {config.label} ({levelStudents.length})
                  </div>
                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                    {levelStudents.map((s) => (
                      <div key={s.id} className="text-sm px-2 py-1 bg-muted rounded">
                        {s.firstName} {s.lastName[0]}.
                      </div>
                    ))}
                    {levelStudents.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-2">Aucun élève</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
