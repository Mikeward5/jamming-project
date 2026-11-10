import TrackList from "./TrackList";
import styles from "./PlayList.module.css";

function PlayList({ playList, addTrack, removeTrack }) {
  return (
    <div className={styles.searchResultsContainer}>
      <h2 className={styles.searchResultsHeader}>PlayList</h2>
      <TrackList
        tracks={playList}
        addTrack={addTrack}
        isPlayList={true}
        removeTrack={removeTrack}
      />
    </div>
  );
}

export default PlayList;
