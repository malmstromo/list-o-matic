import { Button } from 'react-bootstrap';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface LoginButtonProps {
  signedIn: boolean;
  onClick: () => void;
}

export const LoginButton = ({ onClick, signedIn }: LoginButtonProps) => {
  return (
    <Fragment>
      {signedIn ? (
        <Fragment>
          <span>Signed in!</span>
          <FontAwesomeIcon title={'Signed in!'} icon={faCheckCircle} />
        </Fragment>
      ) : (
        <Button variant="primary" id="signIn" onClick={onClick}>
          Sign in
        </Button>
      )}
    </Fragment>
  );
};
