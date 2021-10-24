import { CloseButton } from 'react-bootstrap';
import { Fragment } from 'react';

interface ErrorProps {
  message: string;
  onClick: () => void;
}

export const Error = ({ onClick, message }: ErrorProps) => {
  const ErrorMessage = () => {
    return (
      <div className="bg-red p-3">
        <CloseButton id="hideErrorButton" onClick={onClick} />
        {message}
      </div>
    );
  };

  return <Fragment>{message ? <ErrorMessage /> : null}</Fragment>;
};
