import { useState, useEffect } from "react";
import "./App.css";
import SearchResults from "./components/SearchResults";
import PlayList from "./components/PlayList";
import SearchBar from "./components/SearchBar";
import {
  redirectToSpotify,
  processSpotifyCallback,
  getAccessToken,
  searchTracks,
} from "./spotify";

function App() {
  const [playList, setPlayList] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let active = true;

    async function initializeSpotify() {
      try {
        const url = new URL(window.location.href);

        if (url.pathname === "/callback") {
          await processSpotifyCallback();
        }

        const token = await getAccessToken();

        if (active) {
          setIsAuthenticated(Boolean(token));
          setAuthError("");
        }
      } catch (error) {
        console.error("Spotify authentication error:", error);

        if (active) {
          setAuthError(error.message);
        }
      }
    }

    initializeSpotify();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!submittedSearch) return;

    let active = true;

    async function fetchTracks() {
      try {
        const tracks = await searchTracks(submittedSearch);

        if (active) {
          setSearchResults(tracks);
        }
      } catch (error) {
        console.error("Spotify search error:", error);

        if (active) {
          setSearchResults([]);
        }
      }
    }

    fetchTracks();

    return () => {
      active = false;
    };
  }, [submittedSearch]);

  function addTrack(trackId) {
    const newTrack = searchResults.find((item) => item.id === trackId);
    if (!newTrack) return;
    setPlayList((prev) => {
      const check = prev.some((item) => item.id === trackId);
      if (check) {
        return prev;
      }
      return [...prev, newTrack];
    });
  }

  function removeTrack(trackId) {
    setPlayList((prev) => prev.filter((toRemove) => toRemove.id !== trackId));
  }

  function handlePlaylistNameChange({ target }) {
    setPlaylistName(target.value);
  }

  function handleSearchTermChange({ target }) {
    setSearchTerm(target.value);
  }

  function handleSearch() {
    console.log(searchTerm);
    setSubmittedSearch(searchTerm);
  }

  return (
    <>
      {!isAuthenticated && (
        <button type="button" onClick={redirectToSpotify}>
          Login with Spotify
        </button>
      )}

      {authError && <p role="alert">{authError}</p>}
      <SearchBar
        searchTerm={searchTerm}
        handleSearchTermChange={handleSearchTermChange}
        handleSearch={handleSearch}
        setSearchTerm={setSearchTerm}
      />
      <div className="container">
        <SearchResults searchResults={searchResults} addTrack={addTrack} />
        <PlayList
          playList={playList}
          removeTrack={removeTrack}
          playlistName={playlistName}
          handlePlaylistNameChange={handlePlaylistNameChange}
          setPlaylistName={setPlaylistName}
          setPlayList={setPlayList}
        />
      </div>
    </>
  );
}

export default App;
