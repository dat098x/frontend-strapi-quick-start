import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [modifiedData, setModifiedData] = useState({
    name: "",
    description: "",
    categories: [],
  });
  const [allCategories, setAllCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading((prev) => !prev);
      try {
        const response = await axios.get("http://localhost:1337/categories");
        setAllCategories([...response.data]);
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

  const handleInputChange = ({ target: { name, value } }) => {
    setModifiedData({
      ...modifiedData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    console.log("Submit...");
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:1337/restaurants",
        modifiedData
      );
      console.log(response);
    } catch (error) {
      setError({ error });
    }
  };

  const renderCheckbox = (category) => {
    const { categories } = modifiedData;
    const isChecked = categories.includes(category.id);
    const handleChange = () => {
      if (!categories.includes(category.id)) {
        handleInputChange({
          target: { name: "categories", value: categories.concat(category.id) },
        });
      } else {
        handleInputChange({
          target: {
            name: "categories",
            value: categories.filter((v) => v !== category.id),
          },
        });
      }
    };

    return (
      <div key={category.id}>
        <label htmlFor={category.id}>{category.name}</label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          name="categories"
          id={category.id}
        />
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  } else
    return error ? (
      <div>An error occured: {error.message}</div>
    ) : (
      <div className="App">
        <form onSubmit={handleSubmit}>
          <h3>Restaurants</h3>
          <br />
          <label>
            Name:
            <input
              type="text"
              name="name"
              onChange={handleInputChange}
              value={modifiedData.name}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              onChange={handleInputChange}
              value={modifiedData.description}
            />
          </label>
          <div>
            <br />
            <b>Select categories</b>
            {allCategories.map(renderCheckbox)}
          </div>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
}

export default App;
