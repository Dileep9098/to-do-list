
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import AddData from "./Componant/AddData";
import SearchBar from "./Componant/SearchBar";
import Pagination from "./Componant/Pagination";
import ListTable from "./Componant/ListTable";
import { showErrorMessage, showSuccessMessage } from "./Componant/ShowMessage";

function App() {
  const [data, setData] = useState("");
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const localastorageData = JSON.parse(localStorage.getItem("Data")) || [];



  // Fetch data from API and local storage on component mount

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
        if (localastorageData.length > 0) {
          res.data.unshift(...localastorageData);

        }

        setItems(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);


 const addItem = async () => {
  try {
    if (!data.trim()) {
      alert("Please fill the data");
      return;
    }

    const newId =
      localastorageData.length > 0
        ? localastorageData[0].id + 1 
        : 201; 

    const newItem = {
      id: newId,
      title: data,
      completed: false,
    };

    await axios.post("https://jsonplaceholder.typicode.com/todos", newItem);
    localastorageData.unshift(newItem);
    localStorage.setItem("Data", JSON.stringify(localastorageData));
    setItems([newItem, ...items]);
    setData("");
    showSuccessMessage("Data added successfully!");

  } catch (error) {
    showErrorMessage("Error adding item:", error)
  }
};


const deleteItem = async (id) => {
  try {
    await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);

    const updatedItems = items.filter((curElem) => curElem.id !== id);
    setItems(updatedItems);

    const localStorageData = JSON.parse(localStorage.getItem("Data")) || [];
    const updatedLocalData = localStorageData.filter((curElem) => curElem.id !== id);
    localStorage.setItem("Data", JSON.stringify(updatedLocalData));
    showSuccessMessage("Item deleted successfully!");
  } catch (error) {
        showErrorMessage("Error adding item:", error)

  }
};


// Filter items based on search query

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

 
// Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }
    return [...Array(end - start + 1)].map((_, i) => start + i);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex justify-center items-start py-10">
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          To-Do List
        </h1>

        <AddData data={data} setData={setData} addItem={addItem} />
        <SearchBar search={search} setSearch={setSearch} />

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <ListTable
              currentItems={currentItems}
              deleteItem={deleteItem}
              setItems={setItems}
              indexOfFirstItem={indexOfFirstItem}
            />
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              getPageNumbers={getPageNumbers}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
