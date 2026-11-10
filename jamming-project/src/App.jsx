import { useState } from "react";
import "./App.css";
import SearchResults from "./components/SearchResults";
import PlayList from "./components/PlayList";

function App() {
  const [playList, setPlayList] = useState([]);

  function addTrack(trackId) {
    const newTrack = testArray.find((item) => item.id === trackId);
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

  const testArray = [
    {
      name: "Hello",
      artist: "Mike",
      album: "Testing",
      id: 1,
    },
    {
      name: "Hello",
      artist: "MikeWard",
      album: "Test",
      id: 2,
    },
    {
      name: "Helloworld",
      artist: "bob",
      album: "Testing",
      id: 3,
    },
  ];
  return (
    <div className="container">
      <SearchResults searchResults={testArray} addTrack={addTrack} />
      <PlayList playList={playList} removeTrack={removeTrack} />
    </div>
  );
}

export default App;
