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

import {
  ArrowBack,
  CheckCircle,
  LocalShipping,
  LocationOn,
  Store,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

const STEPS = [
  "PENDING",
  "PHARMACY_ACCEPTED",
  "PACKING",
  "READY_FOR_PICKUP",
  "DELIVERY_ASSIGNED",
  "PICKED_UP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

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

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/${id}`);

      setOrder(response.data?.order || null);
    } catch (err) {
      console.error("Failed to load order:", err);

      setError(err.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

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

  if (error || !order) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error || "Order not found"}</Alert>

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

  const currentIndex = STEPS.indexOf(order.orderStatus);

  const isRejected = order.orderStatus === "REJECTED";

  const isCancelled = order.orderStatus === "CANCELLED";

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

      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/customer/orders")}
        sx={{ mb: 2 }}
      >
        Back to Orders
      </Button>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>
          Order #{order._id?.slice(-8).toUpperCase()}
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
        </Typography>
      </Box>

      {/* REJECTED */}

      {isRejected && (
        <Alert severity="error" sx={{ mb: 3 }}>
          This order was rejected by the pharmacy.
        </Alert>
      )}

      {isCancelled && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          This order has been cancelled.
        </Alert>
      )}

      {/* STATUS */}

      {!isRejected && !isCancelled && (
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
              Order Status
            </Typography>

            <Stack spacing={2}>
              {STEPS.map((step, index) => {
                const completed = currentIndex >= index;

                const active = currentIndex === index;

                return (
                  <Box
                    key={step}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        bgcolor: completed ? "success.main" : "grey.200",
                        color: completed ? "white" : "text.secondary",
                      }}
                    >
                      {completed ? <CheckCircle fontSize="small" /> : index + 1}
                    </Box>

                    <Box>
                      <Typography fontWeight={active ? 800 : 600}>
                        {STATUS_LABELS[step]}
                      </Typography>

                      {active && (
                        <Typography variant="caption" color="text.secondary">
                          Current status
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      )}

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
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Store color="primary" />

            <Box>
              <Typography variant="h6" fontWeight={800}>
                {order.pharmacy?.storeName || "Pharmacy"}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {order.pharmacy?.phone || ""}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {order.pharmacy?.address?.street || ""}
                {order.pharmacy?.address?.city
                  ? `, ${order.pharmacy.address.city}`
                  : ""}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* ITEMS */}

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
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            Medicines
          </Typography>

          <Stack spacing={2}>
            {order.items?.map((item, index) => {
              const price = Number(item.price || 0);

              const discount = Number(item.discount || 0);

              const effectivePrice = price - (price * discount) / 100;

              return (
                <Box key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography fontWeight={700}>
                        {item.medicine?.name || "Medicine"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "right" }}>
                      <Typography fontWeight={800}>
                        ₹{(effectivePrice * item.quantity).toFixed(2)}
                      </Typography>

                      {discount > 0 && (
                        <Typography variant="caption" color="success.main">
                          {discount}% discount
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {index < order.items.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* DELIVERY */}

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
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            Delivery Address
          </Typography>

          <Stack direction="row" spacing={2}>
            <LocationOn color="primary" />

            <Typography>
              {order.deliveryAddress?.street}
              {order.deliveryAddress?.city
                ? `, ${order.deliveryAddress.city}`
                : ""}
              {order.deliveryAddress?.state
                ? `, ${order.deliveryAddress.state}`
                : ""}
              {order.deliveryAddress?.pincode
                ? ` - ${order.deliveryAddress.pincode}`
                : ""}
            </Typography>
          </Stack>

          {order.deliveryPartner && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "primary.50",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <LocalShipping color="primary" />

                <Box>
                  <Typography fontWeight={700}>Delivery Partner</Typography>

                  <Typography variant="body2" color="text.secondary">
                    {order.deliveryPartner.name}
                    {" • "}
                    {order.deliveryPartner.phone}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* PAYMENT */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            Payment Summary
          </Typography>

          <Stack spacing={1.5}>
            <SummaryRow
              label="Subtotal"
              value={`₹${Number(order.subtotal || 0).toFixed(2)}`}
            />

            <SummaryRow
              label="Delivery Fee"
              value={`₹${Number(order.deliveryFee || 0).toFixed(2)}`}
            />

            <SummaryRow
              label="Discount"
              value={`- ₹${Number(order.discount || 0).toFixed(2)}`}
            />

            <Divider />

            <SummaryRow
              label="Total"
              value={`₹${Number(order.totalAmount || 0).toFixed(2)}`}
              strong
            />

            <Chip
              label={`Payment: ${order.paymentStatus}`}
              color={
                order.paymentStatus === "SUCCESS"
                  ? "success"
                  : order.paymentStatus === "FAILED"
                    ? "error"
                    : "warning"
              }
              sx={{ alignSelf: "flex-start" }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* TRACK BUTTON */}

      {["DELIVERY_ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY"].includes(
        order.orderStatus,
      ) && (
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<LocalShipping />}
          sx={{ mt: 3 }}
          onClick={() => navigate(`/customer/tracking?order=${order._id}`)}
        >
          Track Delivery
        </Button>
      )}
    </Box>
  );
}

function SummaryRow({ label, value, strong = false }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography fontWeight={strong ? 800 : 500}>{label}</Typography>

      <Typography fontWeight={strong ? 800 : 600}>{value}</Typography>
    </Box>
  );
}

export default OrderDetails;
