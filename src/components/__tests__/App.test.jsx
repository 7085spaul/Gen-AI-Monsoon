import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('should render the header', () => {
    render(<App />);
    expect(screen.getByText('Monsoon Preparedness AI')).toBeInTheDocument();
  });

  it('should render navigation tabs', () => {
    render(<App />);
    expect(screen.getByText('Weather Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Preparedness Plan')).toBeInTheDocument();
    expect(screen.getByText('Emergency Checklist')).toBeInTheDocument();
  });

  it('should render footer', () => {
    render(<App />);
    expect(screen.getByText(/Powered by Google Gemini/)).toBeInTheDocument();
  });
});
