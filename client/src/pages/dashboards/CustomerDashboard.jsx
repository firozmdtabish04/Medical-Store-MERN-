import { useAuth } from "../../context/AuthContext";

function CustomerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Customer Dashboard</h1>

      <p>Welcome, {user?.name}</p>
      <p>Role: {user?.role}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default CustomerDashboard;
