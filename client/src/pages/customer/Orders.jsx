import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import {
  AccessTime,
  ArrowForward,
  CheckCircle,
  LocalShipping,
  Refresh,
  Search,
  ShoppingBag,
  TableChart,
  ViewAgenda,
} from "@mui/icons-material";

import { DataGrid } from "@mui/x-data-grid";
import api from "../../services/api";

const STATUS_CONFIG = {
  PENDING: {
    label: "Order Placed",
    color: "warning",
  },
  PHARMACY_ACCEPTED: {
    label: "Accepted by Pharmacy",
    color: "info",
  },
  PACKING: {
    label: "Packing",
    color: "secondary",
  },
  READY_FOR_PICKUP: {
    label: "Ready for Pickup",
    color: "success",
  },
  DELIVERY_ASSIGNED: {
    label: "Delivery Assigned",
    color: "info",
  },
  PICKED_UP: {
    label: "Picked Up",
    color: "info",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "primary",
  },
  DELIVERED: {
    label: "Delivered",
    color: "success",
  },
  REJECTED: {
    label: "Rejected",
    color: "error",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "error",
  },
};

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' (MUI DataGrid) or 'cards'

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/my");

      setOrders(
        Array.isArray(response.data?.orders) ? response.data.orders : [],
      );
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(err.response?.data?.message || "Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return orders;

    return orders.filter((order) => {
      const orderId = order._id?.toLowerCase() || "";
      const pharmacy = order.pharmacy?.storeName?.toLowerCase() || "";
      const status = order.orderStatus?.toLowerCase() || "";

      return (
        orderId.includes(value) ||
        pharmacy.includes(value) ||
        status.includes(value)
      );
    });
  }, [orders, search]);

  const getStatus = (status) =>
    STATUS_CONFIG[status] || {
      label: status || "Unknown",
      color: "default",
    };

  // MUI DataGrid Columns
  const columns = useMemo(
    () => [
      {
        field: "orderId",
        headerName: "Order ID",
        width: 140,
        renderCell: (params) => (
          <Typography
            variant="body2"
            fontWeight={700}
            color="success.main"
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => navigate(`/customer/orders/${params.row.rawId}`)}
          >
            #{params.value}
          </Typography>
        ),
      },
      {
        field: "date",
        headerName: "Placed Date",
        width: 150,
      },
      {
        field: "pharmacy",
        headerName: "Pharmacy Store",
        width: 220,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {params.value}
          </Typography>
        ),
      },
      {
        field: "itemsSummary",
        headerName: "Prescriptions & Medicines",
        flex: 1,
        minWidth: 220,
        renderCell: (params) => (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: "totalAmount",
        headerName: "Total Amount",
        width: 130,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={800} color="text.primary">
            ₹{params.value}
          </Typography>
        ),
      },
      {
        field: "orderStatus",
        headerName: "Live Status",
        width: 180,
        renderCell: (params) => {
          const cfg = getStatus(params.value);
          return (
            <Chip
              size="small"
              label={cfg.label}
              color={cfg.color}
              sx={{ fontWeight: 700, fontSize: "0.75rem", borderRadius: 1.5 }}
            />
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 160,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            size="small"
            variant="contained"
            color="success"
            endIcon={<ArrowForward fontSize="small" />}
            onClick={() =>
              navigate(`/customer/tracking?order=${params.row.rawId}`)
            }
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 2,
              boxShadow: "none",
              fontSize: "0.75rem",
            }}
          >
            Track Order
          </Button>
        ),
      },
    ],
    [navigate],
  );

  // MUI DataGrid Rows
  const rows = useMemo(() => {
    return filteredOrders.map((o) => ({
      id: o._id,
      rawId: o._id,
      orderId: o._id ? o._id.slice(-6).toUpperCase() : "N/A",
      date: o.createdAt
        ? new Date(o.createdAt).toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "-",
      pharmacy: o.pharmacy?.storeName || "MediFind Partner Pharmacy",
      itemsSummary:
        Array.isArray(o.items) && o.items.length > 0
          ? o.items
              .map(
                (i) => `${i.medicine?.name || "Medicine"} (${i.quantity} pcs)`,
              )
              .join(", ")
          : "Prescription Medicines",
      totalAmount: o.totalAmount ?? 0,
      orderStatus: o.orderStatus || "PENDING",
    }));
  }, [filteredOrders]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            My Orders
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Interactive MUI DataGrid and live telemetry tracking for your
            prescriptions.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          {/* View Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, next) => next && setViewMode(next)}
            size="small"
            sx={{ bgcolor: "white" }}
          >
            <ToggleButton value="table" title="MUI DataGrid Table View">
              <TableChart fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="caption" fontWeight={700}>
                DataGrid
              </Typography>
            </ToggleButton>
            <ToggleButton value="cards" title="Cards View">
              <ViewAgenda fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="caption" fontWeight={700}>
                Cards
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="outlined"
            color="success"
            startIcon={<Refresh />}
            onClick={fetchOrders}
            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700 }}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* ERROR */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* SEARCH BAR */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          bgcolor: "white",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by order ID, pharmacy store or live status..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Paper>

      {/* ORDERS CONTENT */}
      {filteredOrders.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            py: 10,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            bgcolor: "white",
          }}
        >
          <ShoppingBag sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" fontWeight={700}>
            No orders found
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Your medicine orders will appear here.
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{
              mt: 3,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
            }}
            onClick={() => navigate("/customer/medicines")}
          >
            Find Medicines
          </Button>
        </Paper>
      ) : viewMode === "table" ? (
        /* MUI DATA GRID VIEW */
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            bgcolor: "white",
            overflow: "hidden",
            boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box sx={{ height: 520, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 8, page: 0 },
                },
              }}
              pageSizeOptions={[5, 8, 15, 25]}
              disableRowSelectionOnClick
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: "#f8fafc",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                },
                "& .MuiDataGrid-cell": {
                  display: "flex",
                  alignItems: "center",
                  py: 1.5,
                },
                "& .MuiDataGrid-row:hover": {
                  bgcolor: "#f0fdf4",
                },
              }}
            />
          </Box>
        </Paper>
      ) : (
        /* CARDS VIEW */
        <Stack spacing={2}>
          {filteredOrders.map((order) => {
            const status = getStatus(order.orderStatus);

            return (
              <Card
                key={order._id}
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  bgcolor: "white",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "success.light",
                    boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.06)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", sm: "center" },
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Typography variant="h6" fontWeight={800}>
                          #{order._id?.slice(-6).toUpperCase()}
                        </Typography>
                        <Chip
                          size="small"
                          label={status.label}
                          color={status.color}
                          sx={{ fontWeight: 700 }}
                        />
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {order.pharmacy?.storeName ||
                          "MediFind Partner Pharmacy"}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        endIcon={<ArrowForward />}
                        onClick={() =>
                          navigate(`/customer/tracking?order=${order._id}`)
                        }
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 700,
                        }}
                      >
                        Track Order
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          navigate(`/customer/orders/${order._id}`)
                        }
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 700,
                        }}
                      >
                        Details
                      </Button>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Stack direction="row" spacing={3}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          ITEMS
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {order.items?.length || 0} Prescriptions
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          TOTAL AMOUNT
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={800}
                          color="success.main"
                        >
                          ₹{order.totalAmount || 0}
                        </Typography>
                      </Box>
                    </Stack>

                    <Typography variant="caption" color="text.disabled">
                      {new Date(order.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}

export default Orders;
