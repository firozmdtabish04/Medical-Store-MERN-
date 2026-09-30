import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  CheckCircle,
  LocalShipping,
  LocationOn,
  Store,
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

const STATUS_ORDER = [
  "PENDING",
  "PHARMACY_ACCEPTED",
  "PACKING",
  "READY_FOR_PICKUP",
  "DELIVERY_ASSIGNED",
  "PICKED_UP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function OrderTracking() {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("order");

  const [order, setOrder] = useState(null);
  const [location, setLocation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);

        setOrder(response.data?.order || null);
      } catch (err) {
        console.error("Tracking order error:", err);

        setError(
          err.response?.data?.message || "Unable to load order tracking.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();

    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      socket.emit("join-order", orderId);
    });

    socket.on("order-status-updated", (data) => {
      if (!data || data.orderId === orderId) {
        setOrder((previous) =>
          previous
            ? {
                ...previous,
                orderStatus:
                  data.status || data.orderStatus || previous.orderStatus,
              }
            : previous,
        );
      }
    });

    socket.on("delivery-location-updated", (data) => {
      if (!data || data.orderId === orderId) {
        setLocation(data);
      }
    });

    return () => {
      socket.emit("leave-order", orderId);
      socket.disconnect();
    };
  }, [orderId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">Order not found.</Alert>
      </Box>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(order.orderStatus);

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
      <Typography variant="h4" fontWeight={800}>
        Track Order
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        Order #{order._id?.slice(-8).toUpperCase()}
      </Typography>

      {/* CURRENT STATUS */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <LocalShipping color="primary" sx={{ fontSize: 40 }} />

            <Box>
              <Typography variant="h6" fontWeight={800}>
                {STATUS_LABELS[order.orderStatus] || order.orderStatus}
              </Typography>

              <Chip
                label={order.orderStatus}
                size="small"
                color="primary"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* TIMELINE */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
            Delivery Progress
          </Typography>

          <Stack spacing={2}>
            {STATUS_ORDER.map((status, index) => {
              const completed = currentIndex >= index;

              return (
                <Box
                  key={status}
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: completed ? "success.main" : "grey.200",
                      color: completed ? "white" : "text.secondary",
                    }}
                  >
                    {completed ? <CheckCircle fontSize="small" /> : index + 1}
                  </Box>

                  <Typography
                    fontWeight={status === order.orderStatus ? 800 : 500}
                  >
                    {STATUS_LABELS[status]}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* PHARMACY */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2}>
            <Store color="primary" />

            <Box>
              <Typography fontWeight={800}>
                {order.pharmacy?.storeName || "Pharmacy"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {order.pharmacy?.address?.street || ""}
                {order.pharmacy?.address?.city
                  ? `, ${order.pharmacy.address.city}`
                  : ""}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* DELIVERY PARTNER */}

      {order.deliveryPartner && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={2}>
              <LocalShipping color="primary" />

              <Box>
                <Typography fontWeight={800}>Delivery Partner</Typography>

                <Typography variant="body2" color="text.secondary">
                  {order.deliveryPartner.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {order.deliveryPartner.phone}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* LIVE LOCATION */}

      {location && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={2}>
              <LocationOn color="error" />

              <Box>
                <Typography fontWeight={800}>Live Delivery Location</Typography>

                <Typography variant="body2" color="text.secondary">
                  Latitude: {location.latitude ?? location.lat ?? "-"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Longitude: {location.longitude ?? location.lng ?? "-"}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default OrderTracking;
