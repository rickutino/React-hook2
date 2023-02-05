import React, { useCallback, useEffect, useState, useMemo, memo } from "react";
import { HeadCounter } from "./Components/Counter";
import { FabButton } from "./Components/FabButton";
import { RepositoryList } from "./Components/RepositoryList";

import Navbar from "./Components/Navbar";
import { likesCounter } from "./Services/expensiveCalculation";
import { Repository } from "./Components/Repository";

const SEARCH = "https://api.github.com/search/repositories";

const Repos = memo(({ getRepositories }) => {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("facebook");

  useEffect(() => {
    getRepositories(query)
      .then((response) => response.json())
      .then((data) => data(( data && data.items) || []));
  }, [getRepositories, query]);

  return(
    <div className="list">
      <button
        className="float-btn-rocket"
        onClick={() => setQuery("rocketseat")}
      >
      </button>

      <br />

      {items && items.map((result) => <Repository key={result.id} {...result} />)}
    </div>
  );
});

function App() {
  const [totalLikes, setTotalLikes] = useState(0);
  const [dark, setDark] = useState(false);

  const getRepositories = useCallback((query) => fetch(`${SEARCH}?q=${query}`),[]);

  const likes = useMemo(() => likesCounter(totalLikes), [totalLikes]);

  const theme = useMemo(() => ({
    color: dark ? "#fff" : "#333",
    navbar: dark ? "#1a202c" : "#e5e7eb",
    backgroundColor: dark ? "#333" : "#fff",
  }), [dark]);

  const toogleDarkmode = () => setDark(!dark);
  useEffect(() => console.log("Theme updated"), [theme]);

  return (
    <div style={theme} className="App">
      <Navbar theme={theme.navbar} toogleDarkmode={toogleDarkmode} />
      <HeadCounter likes={likes} />
      <RepositoryList getRepositories={getRepositories} />
      <FabButton totalLikes={totalLikes} setTotalLikes={setTotalLikes} />
    </div>
  );
};

export default App;
