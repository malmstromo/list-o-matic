import { render, fireEvent } from '@testing-library/react';
import { Error } from '../Error';

test('If a message is provided, show an error and call the prop function when clicked', () => {
  const onClick = jest.fn();
  const message = 'foo';
  const { container } = render(
    <Error onClick={onClick} message={message}></Error>
  );

  const hideErrorButton = container.querySelector(
    '#hideErrorButton'
  ) as Element;
  expect(hideErrorButton).toBeTruthy;
  fireEvent.click(hideErrorButton);
  expect(onClick).toHaveBeenCalled();
});
