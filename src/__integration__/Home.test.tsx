import { Home } from '../pages/Home';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import * as contentActions from '../chrome/content_actions';

import '@testing-library/jest-dom';
jest.mock('../chrome/content_actions');

test('Checks for login state on mount', () => {
  render(<Home />, { wrapper: MemoryRouter });
  expect(contentActions.getLoginState).toHaveBeenCalled;
});

test('Starts sign in process on login button click', () => {
  const { getByText } = render(<Home />, {
    wrapper: MemoryRouter,
  });
  const loginButton = getByText('Sign in');
  fireEvent.click(loginButton);
  expect(contentActions.getLogin).toHaveBeenCalled;
});
