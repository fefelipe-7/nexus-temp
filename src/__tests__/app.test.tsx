import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { RouterProvider } from '../components/RouterContext';
import { NexusAlertProvider } from '../components/NexusAlertContext';

describe('App renderizacao', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/home');
  });

  it('renderiza sem crash', () => {
    render(
      <RouterProvider>
        <NexusAlertProvider>
          <App />
        </NexusAlertProvider>
      </RouterProvider>
    );
    expect(document.body).toBeDefined();
  });

  it('renderiza navegacao inferior', () => {
    render(
      <RouterProvider>
        <NexusAlertProvider>
          <App />
        </NexusAlertProvider>
      </RouterProvider>
    );
    expect(screen.getByText('Nexus')).toBeDefined();
  });
});
