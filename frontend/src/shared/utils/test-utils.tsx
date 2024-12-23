import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { AuthProvider } from '@/features/auth/contexts/AuthContext';

function render(ui: React.ReactElement, { ...renderOptions } = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// テストライブラリの他の機能をre-export
export * from '@testing-library/react';
export { render }; 