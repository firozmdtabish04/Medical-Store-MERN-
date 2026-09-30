import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { LocalPharmacy, Visibility, ShoppingBag } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "warning",
  },
  PHARMACY_ACCEPTED: {
    label: "Accepted",
    color: "info",
  },
  REJECTED: {
    label: "Rejected",
    color: "error",
  },
  PACKING: {
    label: "Packing",
    color: "info",
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
  CANCELLED: {
    label: "Cancelled",
    color: "error",
  },
};

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/my");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);

      setError(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatus = (status) => {
    return (
      statusConfig[status] || {
        label: status,
        color: "default",
      }
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        backgroundColor: "#f8fafc",
        p: {
          xs: 2,
          md: 3,
          lg: 4,
        },
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0f172a">
            My Orders
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Track and manage your medicine orders
          </Typography>
        </Box>

        <Button variant="outlined" onClick={fetchOrders}>
          Refresh
        </Button>
      </Box>

      {/* ERROR */}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* LOADING */}

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* EMPTY */}

      {!loading && orders.length === 0 && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
          }}
        >
          <CardContent
            sx={{
              textAlign: "center",
              py: 10,
            }}
          >
            <ShoppingBag
              sx={{
                fontSize: 60,
                color: "#94a3b8",
              }}
            />

            <Typography variant="h6" fontWeight={700} mt={2}>
              No orders yet
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Your medicine orders will appear here.
            </Typography>

            <Button
              variant="contained"
              sx={{
                mt: 3,
                textTransform: "none",
              }}
              onClick={() => navigate("/customer/medicines")}
            >
              Browse Medicines
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ORDERS */}

      {!loading &&
        orders.map((order) => {
          const status = getStatus(order.orderStatus);

          return (
            <Card
              key={order._id}
              elevation={0}
              sx={{
                mb: 2,
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                transition: "0.2s",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(15,23,42,0.07)",
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {/* TOP */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                      xs: "flex-start",
                      sm: "center",
                    },
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Order ID
                    </Typography>

                    <Typography fontWeight={700} fontFamily="monospace">
                      #{order._id.slice(-8)}
                    </Typography>
                  </Box>

                  <Chip
                    label={status.label}
                    color={status.color}
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* PHARMACY */}

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#eff6ff",
                      color: "#2563eb",
                    }}
                  >
                    <LocalPharmacy />
                  </Box>

                  <Box>
                    <Typography fontWeight={700}>
                      {order.pharmacy?.storeName || "Pharmacy"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {order.pharmacy?.phone || "Phone unavailable"}
                    </Typography>
                  </Box>
                </Stack>

                {/* ITEMS */}

                <Box sx={{ mt: 2 }}>
                  {order.items?.map((item, index) => (
                    <Box
                      key={item._id || index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        py: 0.8,
                      }}
                    >
                      <Typography variant="body2">
                        {item.medicine?.name || "Medicine"} × {item.quantity}
                      </Typography>

                      <Typography variant="body2" fontWeight={600}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* TOTAL */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>

                  <Typography variant="h6" fontWeight={800}>
                    ₹{Number(order.totalAmount || 0).toFixed(2)}
                  </Typography>
                </Box>

                {/* ACTION */}

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Visibility />}
                  sx={{
                    mt: 2,
                    borderRadius: "9px",
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                  onClick={() => navigate(`/customer/orders/${order._id}`)}
                >
                  View Order
                </Button>
              </CardContent>
            </Card>
          );
        })}
    </Box>
  );
}

export default Orders;
