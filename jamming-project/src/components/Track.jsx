import styles from "./Track.module.css";
import watermelon from "../assets/watermelon.png";

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
      <img src={watermelon} alt="watermelon" />
      <div className={styles.trackCardDetails}>
        <p className={styles.trackTitle}>{trackName}</p>
        <p>
          {trackAlbum} by {trackArtist}
        </p>
      </div>
      {isPlayList ? (
        <button type="button" onClick={() => removeTrack(trackId)}>
          -
        </button>
      ) : (
        <button type="button" onClick={() => addTrack(trackId)}>
          +
        </button>
      )}
    </div>
  );
}

export default Track;
