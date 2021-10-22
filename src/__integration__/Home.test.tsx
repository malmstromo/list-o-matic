import { Home } from '../pages/Home';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom';
jest.mock('../chrome/content_actions');

test('chrome api events', () => {
  const { getByText } = render(<Home />, { wrapper: MemoryRouter });
  expect(getByText('Home')).toBeTruthy;
});
