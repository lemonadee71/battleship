import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  const header = screen.getByText(/this is my app/i);
  expect(header).toBeInTheDocument();
});
