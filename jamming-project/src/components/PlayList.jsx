import TrackList from "./TrackList";
import styles from "./PlayList.module.css";

function PlayList({
  playList,
  addTrack,
  removeTrack,
  handlePlaylistNameChange,
  playlistName,
  setPlayList,
  setPlaylistName,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    const trackURI = playList.map((item) => item.uri);
    console.log(playlistName);
    console.log(trackURI);
    setPlaylistName("");
    setPlayList([]);
  }

  return (
    <div className={styles.playlistContainer}>
      <h2 className={styles.searchResultsHeader}>PlayList</h2>

      <form className={styles.playlistForm} onSubmit={handleSubmit}>
        <input
          className={styles.playlistInput}
          type="text"
          id="playlist-name"
          value={playlistName}
          onChange={handlePlaylistNameChange}
        />

        <TrackList
          tracks={playList}
          addTrack={addTrack}
          isPlayList={true}
          removeTrack={removeTrack}
        />

        <button className={styles.spotifybutton} type="submit">
          Save to Spotify
        </button>
      </form>
    </div>
  );
}

export default PlayList;
