import { render } from '@testing-library/react';
import { AddToPlaylist } from '../AddToPlaylist';

test('renders learn react link', () => {
  const onClick = jest.fn();
  const songAdded = false;
  const { getByText } = render(
    <AddToPlaylist onClick={onClick} songAdded={songAdded}></AddToPlaylist>
  );

  expect(getByText('Add to playlist')).toBeTruthy;
});
