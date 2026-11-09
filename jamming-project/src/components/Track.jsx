import styles from "./Track.module.css";

function Track({ trackId, trackName, trackArtist, trackAlbum }) {
  return (
    <div className={styles.trackCard}>
      <img src="" />
      <div className={styles.trackCardDetails}>
        <p className={styles.trackTitle}>{trackName}</p>
        <p>
          {trackAlbum} by {trackArtist}
        </p>
      </div>
      <button>+</button>
    </div>
  );
}

export default Track;
