import Track from "./Track";

function TrackList({ testArray }) {
  return (
    <>
      {testArray.map((track) => (
        <div key={track.id}>
          <Track
            trackId={track.id}
            trackName={track.name}
            trackArtist={track.artist}
            trackAlbum={track.album}
          />
        </div>
      ))}
    </>
  );
}

export default TrackList;
