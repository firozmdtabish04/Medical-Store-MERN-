import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import {
  CheckCircle,
  LocalShipping,
  LocationOn,
  Store,
  ArrowBack,
  AccessTime,
  Phone,
  Cancel,
  Check,
  ShoppingBag,
} from "@mui/icons-material";
import { io } from "socket.io-client";
import api from "../../services/api";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const STATUS_LABELS = {
  PENDING: "Order Placed",
  PHARMACY_ACCEPTED: "Pharmacy Accepted",
  PACKING: "Packing",
  READY_FOR_PICKUP: "Ready for Pickup",
  DELIVERY_ASSIGNED: "Delivery Assigned",
  PICKED_UP: "Picked Up",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

const STATUS_STEPS = [
  { key: "PENDING", label: "Order Placed" },
  { key: "PHARMACY_ACCEPTED", label: "Pharmacy Accepted" },
  { key: "PACKING", label: "Packing" },
  { key: "READY_FOR_PICKUP", label: "Ready for Pickup" },
  { key: "DELIVERY_ASSIGNED", label: "Delivery Assigned" },
  { key: "PICKED_UP", label: "Picked Up" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

export default function OrderTracking() {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryId = searchParams.get("order");
  const activeOrderId = paramId || queryId;

  const [order, setOrder] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(activeOrderId || "");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Load user's orders to allow switching or auto-select latest
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        const list = Array.isArray(res.data?.orders) ? res.data.orders : [];
        setUserOrders(list);

        if (!activeOrderId && list.length > 0) {
          // Auto-select latest active order or most recent order
          const active = list.find((o) =>
            !["DELIVERED", "CANCELLED", "REJECTED"].includes(o.orderStatus),
          );
          const chosen = active ? active._id : list[0]._id;
          setSelectedOrderId(chosen);
          setSearchParams({ order: chosen });
        }
      } catch (err) {
        console.warn("Could not load user order list:", err);
      }
    };

    fetchUserOrders();
  }, [activeOrderId]);

  // 2. Fetch specific order details and listen to real-time socket
  useEffect(() => {
    const currentId = activeOrderId || selectedOrderId;
    if (!currentId) {
      if (userOrders.length === 0 && !loading) {
        setLoading(false);
      }
      return;
    }

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/orders/${currentId}`);
        setOrder(response.data?.order || null);
      } catch (err) {
        console.error("Tracking order error:", err);
        setError(
          err.response?.data?.message || "Unable to load order tracking details.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();

    // Socket.IO real-time telemetry
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      socket.emit("join-order", currentId);
    });

    socket.on("order-status-updated", (data) => {
      if (!data || data.orderId === currentId) {
        setOrder((prev) =>
          prev
            ? {
                ...prev,
                orderStatus: data.status || data.orderStatus || prev.orderStatus,
              }
            : prev,
        );
      }
    });

    socket.on("delivery-location-updated", (data) => {
      if (!data || data.orderId === currentId) {
        setLocation(data);
      }
    });

    return () => {
      socket.emit("leave-order", currentId);
      socket.disconnect();
    };
  }, [activeOrderId, selectedOrderId]);

  const handleOrderChange = (e) => {
    const newId = e.target.value;
    setSelectedOrderId(newId);
    setSearchParams({ order: newId });
  };

  if (loading && !order) {
    return (
      <Box
        sx={{
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If customer has no orders at all
  if (!activeOrderId && !selectedOrderId && userOrders.length === 0) {
    return (
      <Box sx={{ maxWidth: 700, mx: "auto", p: { xs: 2, sm: 4 }, textAlign: "center" }}>
        <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 4 }}>
          <ShoppingBag sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" fontWeight={800} gutterBottom>
            No Orders Yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            You haven't placed any medicine orders to track yet. Explore verified pharmacies to order.
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/customer/medicines")}
          >
            Browse Medicines
          </Button>
        </Card>
      </Box>
    );
  }

  if (error && !order) {
    return (
      <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Alert severity="error">{error}</Alert>
        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBack />}
          onClick={() => navigate("/customer/orders")}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  const isTerminalCancelled =
    order?.orderStatus === "CANCELLED" || order?.orderStatus === "REJECTED";
  const stepKeys = STATUS_STEPS.map((s) => s.key);
  const currentIndex = order ? stepKeys.indexOf(order.orderStatus) : -1;

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
        spaceY: 3,
      }}
    >
      {/* Top Navigation & Order Selector */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <div>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Order Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Live real-time delivery and fulfillment status
          </Typography>
        </div>

        {userOrders.length > 1 && (
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="select-order-label">Switch Order</InputLabel>
            <Select
              labelId="select-order-label"
              value={selectedOrderId || order?._id || ""}
              label="Switch Order"
              onChange={handleOrderChange}
            >
              {userOrders.map((o) => (
                <MenuItem key={o._id} value={o._id}>
                  #{o._id.slice(-6).toUpperCase()} • {o.orderStatus}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Stack>

      {/* Main Status Header Card */}
      {order && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 4,
            mb: 3,
            p: 3,
            bgcolor: isTerminalCancelled
              ? "error.50"
              : order.orderStatus === "DELIVERED"
              ? "success.50"
              : "background.paper",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 3,
                  bgcolor: isTerminalCancelled
                    ? "error.main"
                    : order.orderStatus === "DELIVERED"
                    ? "success.main"
                    : "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isTerminalCancelled ? (
                  <Cancel sx={{ fontSize: 30 }} />
                ) : (
                  <LocalShipping sx={{ fontSize: 30 }} />
                )}
              </Box>

              <Box>
                <Typography variant="h6" fontWeight={800}>
                  {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Order ID: #{order._id}
                </Typography>
              </Box>
            </Stack>

            <Chip
              label={order.orderStatus}
              color={
                isTerminalCancelled
                  ? "error"
                  : order.orderStatus === "DELIVERED"
                  ? "success"
                  : "primary"
              }
              sx={{ fontWeight: 700, px: 1 }}
            />
          </Stack>
        </Card>
      )}

      {/* Progress Timeline Stepper */}
      {order && !isTerminalCancelled && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 4,
            mb: 3,
            p: 3,
          }}
        >
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3 }}>
            Fulfillment Progress
          </Typography>

          <Stack spacing={2.5}>
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = currentIndex >= idx;
              const isCurrent = currentIndex === idx;

              return (
                <Stack
                  key={step.key}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: isCompleted
                        ? "success.main"
                        : isCurrent
                        ? "primary.main"
                        : "grey.100",
                      color: isCompleted || isCurrent ? "white" : "text.secondary",
                      fontWeight: 700,
                      fontSize: 14,
                      boxShadow: isCurrent ? 2 : 0,
                    }}
                  >
                    {isCompleted ? <Check sx={{ fontSize: 18 }} /> : idx + 1}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={isCurrent ? 800 : isCompleted ? 600 : 400}
                      color={
                        isCurrent
                          ? "primary.main"
                          : isCompleted
                          ? "text.primary"
                          : "text.secondary"
                      }
                    >
                      {step.label}
                    </Typography>
                  </Box>

                  {isCurrent && (
                    <Chip
                      label="Current Stage"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: 11, fontWeight: 700 }}
                    />
                  )}
                </Stack>
              );
            })}
          </Stack>
        </Card>
      )}

      {/* Cancelled Banner */}
      {isTerminalCancelled && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          This order has been {order.orderStatus.toLowerCase()}. Any pre-authorized amounts will be refunded or no COD charge will be collected.
        </Alert>
      )}

      {/* Two Column Section: Store & Rider Details */}
      {order && (
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 3 }}>
          {/* Pharmacy Info */}
          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 4,
              p: 3,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Store color="primary" />
              <Typography variant="subtitle1" fontWeight={800}>
                Dispensing Pharmacy
              </Typography>
            </Stack>

            <Typography variant="body1" fontWeight={700}>
              {order.pharmacy?.storeName || "Apollo Care Pharmacy"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {order.pharmacy?.address?.street || ""}
              {order.pharmacy?.address?.city
                ? `, ${order.pharmacy.address.city}`
                : ""}
            </Typography>
            {order.pharmacy?.phone && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  {order.pharmacy.phone}
                </Typography>
              </Stack>
            )}
          </Card>

          {/* Delivery Partner Info */}
          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 4,
              p: 3,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <LocalShipping color="primary" />
              <Typography variant="subtitle1" fontWeight={800}>
                Delivery Partner
              </Typography>
            </Stack>

            {order.deliveryPartner ? (
              <Box>
                <Typography variant="body1" fontWeight={700}>
                  {order.deliveryPartner.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Phone: {order.deliveryPartner.phone}
                </Typography>
                <Chip
                  label="Rider Assigned"
                  size="small"
                  color="success"
                  sx={{ mt: 1.5, fontWeight: 700 }}
                />
              </Box>
            ) : (
              <Box sx={{ py: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  A local delivery rider will be assigned as soon as the pharmacy packs your medicine.
                </Typography>
              </Box>
            )}
          </Card>
        </Stack>
      )}

      {/* Live GPS Coordinates (if available) */}
      {location && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "success.light",
            bgcolor: "success.50",
            borderRadius: 4,
            mb: 3,
            p: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <LocationOn color="error" />
            <Box>
              <Typography variant="subtitle2" fontWeight={800}>
                Live Delivery GPS Active
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lat: {location.latitude ?? location.lat ?? "-"}, Lng:{" "}
                {location.longitude ?? location.lng ?? "-"}
              </Typography>
            </Box>
          </Stack>
        </Card>
      )}

      {/* Delivery Address & Items Summary */}
      {order && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 4,
            p: 3,
          }}
        >
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>
            Delivery Details & Summary
          </Typography>

          <Stack spacing={1.5}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                DELIVERING TO
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {order.deliveryAddress?.street}, {order.deliveryAddress?.city},{" "}
                {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                ITEMS ORDERED ({order.items?.length || 0})
              </Typography>
              {order.items?.map((it, idx) => (
                <Stack
                  key={idx}
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mt: 0.5 }}
                >
                  <Typography variant="body2">
                    {it.medicine?.name || "Medicine"} × {it.quantity}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ₹{(it.price * it.quantity).toFixed(2)}
                  </Typography>
                </Stack>
              ))}
            </Box>

            <Divider sx={{ my: 1 }} />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Delivery Fee</Typography>
              <Typography variant="body2">₹{order.deliveryFee ?? 40}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2" fontWeight={800}>
                Total Amount
              </Typography>
              <Typography variant="subtitle2" fontWeight={800} color="success.main">
                ₹{Number(order.totalAmount || 0).toFixed(2)}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/customer/orders/${order._id}`)}
            >
              Full Order Details
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate("/customer/orders")}
            >
              All Orders
            </Button>
          </Stack>
        </Card>
      )}
    </Box>
  );
}
