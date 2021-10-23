import { Button, Row, Col } from 'react-bootstrap';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface LoginButtonProps {
  signedIn: boolean;
  onClick: () => void;
}

export const LoginButton = ({ onClick, signedIn }: LoginButtonProps) => {
  const SignedInMessage = () => {
    return (
      <Row>
        <Col>
          <span>Signed in!</span>
          <FontAwesomeIcon title={'Signed in!'} icon={faCheckCircle} />
        </Col>
      </Row>
    );
  };
  return (
    <Fragment>
      {signedIn ? (
        <SignedInMessage />
      ) : (
        <Button variant="primary" id="signIn" onClick={onClick}>
          Sign in
        </Button>
      )}
    </Fragment>
  );
};
