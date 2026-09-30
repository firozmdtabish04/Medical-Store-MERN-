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
  LocalPharmacy,
  LocalShipping,
  LocationOn,
  Payment,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const statusConfig = {
  PENDING: ["Pending", "warning"],
  PHARMACY_ACCEPTED: ["Accepted", "info"],
  REJECTED: ["Rejected", "error"],
  PACKING: ["Packing", "info"],
  READY_FOR_PICKUP: ["Ready for Pickup", "success"],
  DELIVERY_ASSIGNED: ["Delivery Assigned", "info"],
  PICKED_UP: ["Picked Up", "info"],
  OUT_FOR_DELIVERY: ["Out for Delivery", "primary"],
  DELIVERED: ["Delivered", "success"],
  CANCELLED: ["Cancelled", "error"],
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

      const response = await api.get(`/orders/${id}`);

      setOrder(response.data.order);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to load order");
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
          display: "flex",
          justifyContent: "center",
          py: 12,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!order) return null;

  const status = statusConfig[order.orderStatus] || [
    order.orderStatus,
    "default",
  ];

  return (
    <Box
      sx={{
        minHeight: "100%",
        backgroundColor: "#f8fafc",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* BACK */}

      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/customer/orders")}
        sx={{
          mb: 2,
          textTransform: "none",
        }}
      >
        Back to Orders
      </Button>

      {/* HEADER */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          mb: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
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
              <Typography variant="h5" fontWeight={800}>
                Order #{order._id.slice(-8)}
              </Typography>

              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {new Date(order.createdAt).toLocaleString()}
              </Typography>
            </Box>

            <Chip label={status[0]} color={status[1]} />
          </Box>
        </CardContent>
      </Card>

      {/* STATUS */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          mb: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={800} mb={3}>
            Order Status
          </Typography>

          <Stack spacing={2}>
            {[
              "PENDING",
              "PHARMACY_ACCEPTED",
              "PACKING",
              "READY_FOR_PICKUP",
              "DELIVERY_ASSIGNED",
              "OUT_FOR_DELIVERY",
              "DELIVERED",
            ].map((item) => {
              const active = item === order.orderStatus;

              return (
                <Box
                  key={item}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: active ? "#1976d2" : "#cbd5e1",
                    }}
                  />

                  <Typography
                    fontWeight={active ? 700 : 400}
                    color={active ? "#1976d2" : "text.secondary"}
                  >
                    {statusConfig[item]?.[0] || item}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* MAIN GRID */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.5fr 1fr",
          },
          gap: 2,
        }}
      >
        {/* ITEMS */}

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={800} mb={2}>
              Medicines
            </Typography>

            {order.items?.map((item, index) => (
              <Box key={item._id || index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1.5,
                  }}
                >
                  <Box>
                    <Typography fontWeight={700}>
                      {item.medicine?.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                  </Box>

                  <Typography fontWeight={700}>
                    ₹{Number(item.price || 0).toFixed(2)}
                  </Typography>
                </Box>

                {index < order.items.length - 1 && <Divider />}
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" fontWeight={800}>
                Total
              </Typography>

              <Typography variant="h6" fontWeight={800} color="primary">
                ₹{Number(order.totalAmount || 0).toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* DETAILS */}

        <Stack spacing={2}>
          {/* PHARMACY */}

          <Card
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5}>
                <LocalPharmacy color="primary" />

                <Box>
                  <Typography fontWeight={800}>Pharmacy</Typography>

                  <Typography mt={0.5}>{order.pharmacy?.storeName}</Typography>

                  <Typography variant="body2" color="text.secondary">
                    {order.pharmacy?.phone}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* ADDRESS */}

          <Card
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5}>
                <LocationOn color="primary" />

                <Box>
                  <Typography fontWeight={800}>Delivery Address</Typography>

                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {order.deliveryAddress?.address || "Delivery address"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* PAYMENT */}

          <Card
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5}>
                <Payment color="primary" />

                <Box>
                  <Typography fontWeight={800}>Payment</Typography>

                  <Typography variant="body2" mt={0.5}>
                    {order.paymentStatus}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* DELIVERY */}

          {order.deliveryPartner && (
            <Card
              elevation={0}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5}>
                  <LocalShipping color="primary" />

                  <Box>
                    <Typography fontWeight={800}>Delivery Partner</Typography>

                    <Typography mt={0.5}>
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
        </Stack>
      </Box>
    </Box>
  );
}

export default OrderDetails;
