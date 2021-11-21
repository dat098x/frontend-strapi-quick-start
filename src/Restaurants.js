import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading((prev) => !prev);
      try {
        const response = await axios.get("http://localhost:1337/restaurants");
        setRestaurants([...response.data]);
      } catch (error) {
        setError(error);
      }
    }
    fetchData();
    let timeOut = setTimeout(() => setIsLoading((prev) => !prev), 2000);
    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  } else
    return error ? (
      <div>An error occured: {error.message}</div>
    ) : (
      <div className="App">
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>{restaurant.name}</li>
          ))}
        </ul>
      </div>
    );
}

export default App;
