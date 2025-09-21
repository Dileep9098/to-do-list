import axios from "axios";
import React, { useState } from "react";
import { showSuccessMessage } from "./ShowMessage";

function ListTable({ currentItems, deleteItem, indexOfFirstItem, setItems }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleEditClick = async (id) => {

        try {
            let itemToEdit = null;

            try {
                const res = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
                itemToEdit = res.data;
            } catch (apiError) {
                console.warn("Item not found in API, checking localStorage...");
            }

            if (!itemToEdit) {
                const localStorageData = JSON.parse(localStorage.getItem("Data")) || [];
                itemToEdit = localStorageData.find((item) => item.id === id);
            }

            if (itemToEdit) {
                setSelectedItem(itemToEdit);
                setModalOpen(true);
            } else {
                alert("Item not found!");
            }
        } catch (error) {
            console.error("Error fetching item:", error);
        }
    };

    const handleModalSave = async (updatedItem) => {
        if (!updatedItem.title.trim()) {
            alert("Title cannot be empty!");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const localStorageData = JSON.parse(localStorage.getItem("Data")) || [];
            const itemExistsInLocal = localStorageData.some(
                (item) => Number(item.id) === Number(updatedItem.id)
            );

            if (itemExistsInLocal) {
                const updatedLocalData = localStorageData.map((item) =>
                    Number(item.id) === Number(updatedItem.id)
                        ? { ...item, title: updatedItem.title, completed: updatedItem.completed }
                        : item
                );
                localStorage.setItem("Data", JSON.stringify(updatedLocalData));

                setItems((prev) =>
                    prev.map((item) =>
                        Number(item.id) === Number(updatedItem.id)
                            ? { ...item, ...updatedItem }
                            : item
                    )
                );
            } else {
                await axios.put(
                    `https://jsonplaceholder.typicode.com/todos/${updatedItem.id}`,
                    updatedItem
                );

                setItems((prev) =>
                    prev.map((item) =>
                        Number(item.id) === Number(updatedItem.id)
                            ? { ...item, ...updatedItem }
                            : item
                    )
                );
            }

            setModalOpen(false);
            setSelectedItem(null);
            showSuccessMessage("Item updated successfully!")
        } catch (err) {
            console.error("Error updating item:", err);
            setError("Failed to update item. Try again!");
        } finally {
            setLoading(false);
        }
    };




    return (
        <>
            <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm">
                        <tr>
                            <th className="py-3 px-4 text-center w-16">#</th>
                            <th className="py-3 px-4 text-left">Task</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 text-center w-40">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="odd:bg-gray-50 even:bg-gray-100 hover:bg-indigo-50 transition"
                                >
                                    <td className="py-3 px-4 text-center font-semibold text-gray-800">
                                        {indexOfFirstItem + index + 1}
                                    </td>
                                    <td className="py-3 px-4 font-medium">{item.title}</td>
                                    <td className="py-3 px-4 text-center">
                                        {item.completed ? (
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                                completed
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition">
                                            <span className="material-symbols-outlined">  delete </span>
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(item.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition">
                                            <span className="material-symbols-outlined">  edit   </span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="py-6 text-center text-gray-400 italic text-sm"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 mx-auto mb-2 text-gray-300"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M20.25 7.5l-8.954 8.955c-.44.439-1.152.439-1.591 0L3.75 12.5"
                                        />
                                    </svg>
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modalOpen && selectedItem && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Edit Task</h2>

                        {error && <p className="text-red-600 mb-2">{error}</p>}

                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1">ID</label>
                            <input
                                type="text"
                                value={selectedItem.id}
                                disabled
                                className="w-full px-3 py-2 border rounded-md bg-gray-100"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                value={selectedItem.title}
                                onChange={(e) =>
                                    setSelectedItem({ ...selectedItem, title: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedItem.completed}
                                    onChange={(e) =>
                                        setSelectedItem({ ...selectedItem, completed: e.target.checked })
                                    }
                                    className="w-4 h-4 form-check-input me-3"
                                />
                                <span>Completed</span>
                            </label>
                        </div>
                       

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleModalSave(selectedItem)}
                                className={`px-4 py-2 rounded-md text-white transition ${loading
                                    ? "bg-blue-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>

    );
}

export default ListTable;
