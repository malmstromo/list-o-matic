import { CloseButton } from 'react-bootstrap';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { TrackInfo } from '../types';

interface ErrorProps {
  message: string;
  onClick: () => void;
}

export const Error = ({ onClick, message }: ErrorProps) => {
  const ErrorMessage = () => {
    return (
      <div className="bg-red p-3">
        <CloseButton onClick={onClick} />
        {message}
      </div>
    );
  };

  return <Fragment>{message ? <ErrorMessage /> : null}</Fragment>;
};
