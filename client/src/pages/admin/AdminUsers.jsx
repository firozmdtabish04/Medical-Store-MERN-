import React, { useState, useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, Typography, Button, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon, Refresh, Shield, CheckCircle, Block } from "@mui/icons-material";
import api from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (roleFilter !== "ALL") params.role = roleFilter;
      const res = await api.get("/admin/users", { params });
      setUsers(res.data?.users || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleStatus = async (userId) => {
    try {
      setTogglingId(userId);
      const res = await api.patch(`/admin/users/${userId}/status`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? res.data?.user || u : u)),
      );
    } catch (err) {
      console.error("Failed to toggle status:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q),
    );
  }, [users, search]);

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "User Name",
        width: 190,
        renderCell: (params) => (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-xs font-bold text-green-700">
              {params.value?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <Typography variant="body2" fontWeight={700}>
              {params.value}
            </Typography>
          </div>
        ),
      },
      {
        field: "email",
        headerName: "Email Address",
        width: 220,
      },
      {
        field: "phone",
        headerName: "Phone",
        width: 150,
      },
      {
        field: "role",
        headerName: "Role",
        width: 150,
        renderCell: (params) => {
          const r = params.value;
          const color =
            r === "ADMIN"
              ? "error"
              : r === "PHARMACIST"
              ? "primary"
              : r === "DELIVERY"
              ? "warning"
              : "success";
          return (
            <Chip
              size="small"
              label={r}
              color={color}
              sx={{ fontWeight: 800, fontSize: "0.7rem", borderRadius: 1.5 }}
            />
          );
        },
      },
      {
        field: "isActive",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value ? "Active" : "Inactive"}
            color={params.value ? "success" : "default"}
            icon={params.value ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
            sx={{ fontWeight: 700, fontSize: "0.7rem", borderRadius: 1.5 }}
          />
        ),
      },
      {
        field: "actions",
        headerName: "Manage Status",
        width: 170,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            size="small"
            variant="outlined"
            color={params.row.isActive ? "error" : "success"}
            disabled={togglingId === params.row.id}
            onClick={() => handleToggleStatus(params.row.id)}
            sx={{ textTransform: "none", fontSize: "0.75rem", borderRadius: 2, fontWeight: 700 }}
          >
            {params.row.isActive ? "Deactivate" : "Activate"}
          </Button>
        ),
      },
    ],
    [togglingId],
  );

  const rows = useMemo(() => {
    return filteredUsers.map((u) => ({
      id: u._id,
      name: u.name || "User",
      email: u.email || "-",
      phone: u.phone || "-",
      role: u.role || "CUSTOMER",
      isActive: u.isActive !== false,
    }));
  }, [filteredUsers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            User Accounts & Permissions
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and manage all platform accounts with interactive MUI DataGrid.
          </p>
        </div>

        <Button
          size="small"
          variant="outlined"
          color="success"
          onClick={fetchUsers}
          startIcon={<Refresh />}
          sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
        >
          Refresh Users
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <TextField
          size="small"
          placeholder="Search by name, email, phone or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <div className="flex flex-wrap gap-1 rounded-2xl bg-gray-100 p-1">
          {["ALL", "CUSTOMER", "PHARMACIST", "DELIVERY", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-xl px-3 py-1 text-[11px] font-bold transition ${
                roleFilter === r
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* MUI DataGrid */}
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <Box sx={{ height: 560, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "#f8fafc",
                fontWeight: 800,
                fontSize: "0.8rem",
                textTransform: "uppercase",
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: "#f0fdf4",
              },
            }}
          />
        </Box>
      </div>
    </div>
  );
}
