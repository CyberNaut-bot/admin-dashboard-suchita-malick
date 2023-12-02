import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch users from API and set them in state
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const { id, name, email, role } = user;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      id.toString().includes(lowerCaseQuery) ||
      name.toLowerCase().includes(lowerCaseQuery) ||
      email.toLowerCase().includes(lowerCaseQuery) ||
      role.toLowerCase().includes(lowerCaseQuery)
    );
  });

  // Handle search query change
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle row selection
  const handleRowSelection = (event, user) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, user]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((selectedUser) => selectedUser.id !== user.id)
      );
    }
  };

  // Handle delete selected rows
  const handleDeleteSelectedRows = () => {
    console.log("delet");
    setUsers((prevUsers) =>
      prevUsers.filter(
        (user) =>
          !selectedRows.some((selectedUser) => selectedUser.id === user.id)
      )
    );
    setSelectedRows([]);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Render table rows
  const renderTableRows = () => {
    return filteredUsers.map((user) => (
      <tr key={user.id}>
        <td>
          <input
            type="checkbox"
            checked={selectedRows.some(
              (selectedUser) => selectedUser.id === user.id
            )}
            onChange={(event) => handleRowSelection(event, user)}
          />
        </td>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td>
          <button className="edit" onClick={handleDeleteSelectedRows}>
            Edit
          </button>
          <button className="delete">Delete</button>
          <button className="save">Save</button>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
        <button className="search-icon">Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
      <div>
        <button className="delete-selected" onClick={handleDeleteSelectedRows}>
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
