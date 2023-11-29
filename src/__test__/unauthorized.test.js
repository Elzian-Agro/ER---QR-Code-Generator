import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Unauthorized from '../pages/unauthorized';

test('renders unauthorized component', () => {
  render(<Unauthorized />);

  expect(screen.getByText('unauthorized Access')).toBeInTheDocument();
});

