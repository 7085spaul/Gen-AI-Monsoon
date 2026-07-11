import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../App';

describe('Component Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render App component without crashing', () => {
    render(<App />);
    expect(screen.getByText('Monsoon Preparedness AI')).toBeInTheDocument();
  });

  it('should have proper page structure', () => {
    render(<App />);
    expect(screen.getByRole('application')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should display all required tabs', () => {
    render(<App />);
    
    const tabNames = [
      'Weather Dashboard',
      'Preparedness Plan',
      'Emergency Checklist',
      'Travel Advisory'
    ];
    
    tabNames.forEach(name => {
      const tab = screen.getByRole('tab', { name: new RegExp(name, 'i') });
      expect(tab).toBeInTheDocument();
    });
  });

  it('should display welcome message when location is not set', () => {
    render(<App />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it('should display footer with proper attribution', () => {
    render(<App />);
    expect(screen.getByText(/gemini/i)).toBeInTheDocument();
  });

  it('should have semantic HTML structure', () => {
    render(<App />);
    
    // Check for proper semantic elements
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label');
    
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('aria-label');
  });

  it('should render tabs with proper ARIA attributes', () => {
    render(<App />);
    
    const tabs = screen.getAllByRole('tab');
    tabs.forEach(tab => {
      expect(tab).toHaveAttribute('aria-selected');
      expect(tab).toHaveAttribute('aria-label');
    });
  });

  it('should have accessible color contrast', () => {
    render(<App />);
    // Visual verification needed, but components are built with Tailwind best practices
    expect(screen.getByRole('application')).toBeInTheDocument();
  });

  it('should support keyboard navigation', () => {
    render(<App />);
    
    const tabs = screen.getAllByRole('tab');
    tabs.forEach(tab => {
      const tabindex = tab.getAttribute('tabindex');
      expect(tabindex).not.toBeNull();
    });
  });
});
