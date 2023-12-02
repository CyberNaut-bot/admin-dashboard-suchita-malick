import React, { useState, useEffect } from "react";
import "./App.css"; // Add your styling in App.css

const Home = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = (query) => {
    const filteredData = users.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredUsers(filteredData);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowSelect = (id) => {
    const selectedSet = new Set(selectedRows);
    if (selectedSet.has(id)) {
      selectedSet.delete(id);
    } else {
      selectedSet.add(id);
    }
    setSelectedRows(Array.from(selectedSet));
  };

  const handleSelectAll = () => {
    const allRows = filteredUsers
      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
      .map((user) => user.id);
    setSelectedRows(selectedRows.length === allRows.length ? [] : allRows);
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handleEdit = (id, column, value) => {
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, [column]: value };
      }
      return user;
    });
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  return (
    <div className="App">
      <div className="search-bar">
        <label htmlFor="search">Search:</label>
        <input
          type="text"
          id="search"
          placeholder="Search..."
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button
          className="search-icon"
          onClick={() => handleSearch(document.getElementById("search").value)}
        >
          Search
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.length === pageSize}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            {/* Add more columns as needed */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map((user) => (
              <tr
                key={user.id}
                className={selectedRows.includes(user.id) ? "selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleRowSelect(user.id)}
                    checked={selectedRows.includes(user.id)}
                  />
                </td>
                <td>{user.id}</td>

                <td>{user.name}</td>
                <td>{user.email}</td>
                {/* Add more columns as needed */}
                <td>
                  <button
                    className="edit"
                    onClick={() => handleEdit(user.id, "name", user.name)}
                  >
                    {user.editable ? "Save" : "Edit"}
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDeleteSelected()}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="pagination">
        <button className="first-page" onClick={() => handlePageChange(1)}>
          First
        </button>
        <button
          className="previous-page"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${Math.ceil(
          filteredUsers.length / pageSize
        )}`}</span>
        <button
          className="next-page"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredUsers.length / pageSize)}
        >
          Next
        </button>
        <button
          className="last-page"
          onClick={() =>
            handlePageChange(Math.ceil(filteredUsers.length / pageSize))
          }
        >
          Last
        </button>
      </div>

      <button onClick={() => handleDeleteSelected()}>Delete Selected</button>
    </div>
  );
};

export default Home;
