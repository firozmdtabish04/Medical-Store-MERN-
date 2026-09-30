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
} from "@mui/material";

import {
  AccessTime,
  ArrowForward,
  CheckCircle,
  LocalShipping,
  Refresh,
  Search,
  ShoppingBag,
} from "@mui/icons-material";

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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* HEADER */}

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
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            My Orders
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            View and track your medicine orders.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchOrders}
        >
          Refresh
        </Button>
      </Box>

      {/* ERROR */}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* SEARCH */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search order, pharmacy or status..."
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

      {/* EMPTY */}

      {filteredOrders.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            py: 10,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <ShoppingBag
            sx={{
              fontSize: 60,
              color: "text.disabled",
              mb: 2,
            }}
          />

          <Typography variant="h6" fontWeight={700}>
            No orders found
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Your medicine orders will appear here.
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate("/customer/medicines")}
          >
            Find Medicine
          </Button>
        </Paper>
      ) : (
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
                  transition: "0.2s",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0,0,0,0.07)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* TOP */}

                  <Box
                    sx={{
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
                      <Typography variant="h6" fontWeight={800}>
                        Order #{order._id?.slice(-8).toUpperCase()}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "-"}
                      </Typography>
                    </Box>

                    <Chip
                      label={status.label}
                      color={status.color}
                      icon={
                        order.orderStatus === "DELIVERED" ? (
                          <CheckCircle />
                        ) : order.orderStatus === "OUT_FOR_DELIVERY" ? (
                          <LocalShipping />
                        ) : (
                          <AccessTime />
                        )
                      }
                    />
                  </Box>

                  <Divider sx={{ my: 2.5 }} />

                  {/* PHARMACY + TOTAL */}

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr 1fr",
                      },
                      gap: 3,
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Pharmacy
                      </Typography>

                      <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                        {order.pharmacy?.storeName || "Pharmacy"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {order.pharmacy?.address?.city || ""}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total Amount
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={800}
                        sx={{ mt: 0.5 }}
                      >
                        ₹{Number(order.totalAmount || 0).toFixed(2)}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {order.items?.length || 0} medicine
                        {order.items?.length === 1 ? "" : "s"}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2.5 }} />

                  {/* ITEMS */}

                  <Stack spacing={1}>
                    {order.items?.slice(0, 3).map((item, index) => (
                      <Box
                        key={`${order._id}-${index}`}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {item.medicine?.name || "Medicine"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          × {item.quantity}
                        </Typography>
                      </Box>
                    ))}

                    {order.items?.length > 3 && (
                      <Typography variant="caption" color="text.secondary">
                        + {order.items.length - 3} more medicines
                      </Typography>
                    )}
                  </Stack>

                  {/* ACTIONS */}

                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={1.5}
                    sx={{ mt: 3 }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate(`/customer/orders/${order._id}`)}
                    >
                      View Order
                    </Button>

                    {[
                      "DELIVERY_ASSIGNED",
                      "PICKED_UP",
                      "OUT_FOR_DELIVERY",
                    ].includes(order.orderStatus) && (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<LocalShipping />}
                        onClick={() =>
                          navigate(`/customer/tracking?order=${order._id}`)
                        }
                      >
                        Track Delivery
                      </Button>
                    )}
                  </Stack>
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
