import styles from "./SearchBar.module.css";

function SearchBar({
  searchTerm,
  handleSearchTermChange,
  handleSearch,
  setSearchTerm,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    handleSearch();
    setSearchTerm("");
  }
  return (
    <form className={styles.searchform} onSubmit={handleSubmit}>
      <input
        className={styles.searchinput}
        type="text"
        id="searchbar"
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
      <button className={styles.searchbutton} type="submit">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
