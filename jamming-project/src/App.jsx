import "./App.css";
import SearchResults from "./components/SearchResults";

function App() {
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
    <div>
      <SearchResults testArray={testArray} />
    </div>
  );
}

export default App;
