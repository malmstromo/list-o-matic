import { Button } from 'react-bootstrap';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface AddToPlaylistProps {
  songAdded: boolean;
  onClick: () => void;
}

export const AddToPlaylist = ({ onClick, songAdded }: AddToPlaylistProps) => {
  const SongAdded = () => {
    return (
      <div>
        <span>song added</span>
        <FontAwesomeIcon title={'Song added!'} icon={faCheckCircle} />
      </div>
    );
  };

  const AddToPlaylistButton = () => {
    return (
      <div>
        <Button variant="primary" id="addToPlaylist" onClick={onClick}>
          Add to playlist
        </Button>
      </div>
    );
  };
  return (
    <Fragment>{songAdded ? <SongAdded /> : <AddToPlaylistButton />}</Fragment>
  );
};
