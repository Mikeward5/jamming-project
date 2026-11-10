import Track from "./Track";

function TrackList({ tracks, addTrack, isPlayList, removeTrack }) {
  return (
    <>
      {tracks.map((track) => (
        <div key={track.id}>
          <Track
            trackId={track.id}
            trackName={track.name}
            trackArtist={track.artist}
            trackAlbum={track.album}
            addTrack={addTrack}
            isPlayList={isPlayList}
            removeTrack={removeTrack}
          />
        </div>
      ))}
    </>
  );
}

export default TrackList;
