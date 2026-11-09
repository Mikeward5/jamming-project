import TrackList from "./TrackList";
import styles from "./SearchResults.module.css";

function SearchResults({ testArray }) {
  return (
    <div className={styles.searchResultsContainer}>
      <h2 className={styles.searchResultsHeader}>Search Results</h2>
      <TrackList testArray={testArray} />
    </div>
  );
}

export default SearchResults;
