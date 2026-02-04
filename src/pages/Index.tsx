import { AppProvider } from '@/context/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';

const Index = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default Index;
