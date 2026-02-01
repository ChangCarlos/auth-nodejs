import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';


type Props = {
  children: ReactNode;
};

export function DashboardLayout({ children }: Props) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted">
      <header className="h-14 bg-background border-b flex items-center justify-between px-6">
        <span className="font-semibold">
          Auth Project
        </span>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {user?.email}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
