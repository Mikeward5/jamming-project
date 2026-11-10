import styles from "./Track.module.css";

function Track({
  trackId,
  trackName,
  trackArtist,
  trackAlbum,
  addTrack,
  isPlayList,
  removeTrack,
}) {
  return (
    <div className={styles.trackCard}>
      <img src="" />
      <div className={styles.trackCardDetails}>
        <p className={styles.trackTitle}>{trackName}</p>
        <p>
          {trackAlbum} by {trackArtist}
        </p>
      </div>
      {isPlayList ? (
        <button onClick={() => removeTrack(trackId)}>-</button>
      ) : (
        <button onClick={() => addTrack(trackId)}>+</button>
      )}
    </div>
  );
}

export default Track;
