import TrackList from "./TrackList";
import styles from "./SearchResults.module.css";

function SearchResults({ searchResults, addTrack, removeTrack }) {
  return (
    <div className={styles.searchResultsContainer}>
      <h2 className={styles.searchResultsHeader}>Search Results</h2>
      <TrackList
        tracks={searchResults}
        addTrack={addTrack}
        removeTrack={removeTrack}
        isPlayList={false}
      />
    </div>
  );
}

export default SearchResults;
