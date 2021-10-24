import { Button } from 'react-bootstrap';
import { Fragment } from 'react';
import { TrackInfo } from '../types';

interface GetTrackInfoButtonProps {
  trackInfo: TrackInfo;
  onClick: () => void;
}

export const GetTrackInfoButton = ({
  onClick,
  trackInfo,
}: GetTrackInfoButtonProps) => {
  return (
    <Fragment>
      <Button variant="primary" id="getTrackInfo" onClick={onClick}>
        Get track info
      </Button>
      <p>{trackInfo.artist}</p>
      <p>{trackInfo.song}</p>
    </Fragment>
  );
};
