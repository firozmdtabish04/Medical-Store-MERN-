import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  AccessTime,
  CheckCircle,
  Close,
  Inventory2,
  LocalShipping,
  Refresh,
  Search,
  ShoppingBag,
} from "@mui/icons-material";

import api from "../../services/api";

/* =========================================================
   STATUS CONFIG
========================================================= */

const STATUS_CONFIG = {
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

  CANCELLED: {
    label: "Cancelled",
    color: "error",
  },
};

/* =========================================================
   COMPONENT
========================================================= */

function PharmacyOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [savingId, setSavingId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =========================================================
     SNACKBAR
  ========================================================= */

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  /* =========================================================
     LOAD PHARMACY ORDERS
  ========================================================= */

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/orders/pharmacy/my");

      const data = response.data;

      setOrders(
        Array.isArray(data?.orders)
          ? data.orders
          : Array.isArray(data)
            ? data
            : [],
      );
    } catch (error) {
      console.error("Failed to load pharmacy orders:", error);

      console.error("Pharmacy orders response:", error?.response?.data);

      showMessage(
        error?.response?.data?.message || "Failed to load pharmacy orders",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =========================================================
     UPDATE ORDER STATUS
  ========================================================= */

  const updateStatus = async (orderId, status) => {
    try {
      setSavingId(orderId);

      await api.patch(`/orders/pharmacy/${orderId}/status`, {
        status,
      });

      showMessage(
        `Order ${status.toLowerCase().replaceAll("_", " ")} successfully`,
      );

      await fetchOrders();
    } catch (error) {
      console.error("Order status update error:", error);

      console.error("Order status response:", error?.response?.data);

      showMessage(
        error?.response?.data?.message || "Failed to update order status",
        "error",
      );
    } finally {
      setSavingId(null);
    }
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredOrders = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return orders;
    }

    return orders.filter((order) => {
      const orderId = order?._id?.toLowerCase() || "";

      const customerName = order?.customer?.name?.toLowerCase() || "";

      const customerPhone = order?.customer?.phone?.toLowerCase() || "";

      const customerEmail = order?.customer?.email?.toLowerCase() || "";

      const status = order?.orderStatus?.toLowerCase() || "";

      return (
        orderId.includes(value) ||
        customerName.includes(value) ||
        customerPhone.includes(value) ||
        customerEmail.includes(value) ||
        status.includes(value)
      );
    });
  }, [orders, search]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  /* =========================================================
     KPI
  ========================================================= */

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "PENDING",
  ).length;

  const acceptedOrders = orders.filter(
    (order) =>
      order.orderStatus === "PHARMACY_ACCEPTED" ||
      order.orderStatus === "PACKING",
  ).length;

  const readyOrders = orders.filter(
    (order) => order.orderStatus === "READY_FOR_PICKUP",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.orderStatus === "DELIVERED",
  ).length;

  /* =========================================================
     ACTIONS
  ========================================================= */

  const renderActions = (order) => {
    const status = order?.orderStatus;

    const orderId = order?._id;

    const saving = savingId === orderId;

    /* -------------------------------------------------------
       PENDING
    ------------------------------------------------------- */

    if (status === "PENDING") {
      return (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={
              saving ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <CheckCircle />
              )
            }
            disabled={saving}
            onClick={() => updateStatus(orderId, "PHARMACY_ACCEPTED")}
          >
            Accept
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<Close />}
            disabled={saving}
            onClick={() => updateStatus(orderId, "REJECTED")}
          >
            Reject
          </Button>
        </Stack>
      );
    }

    /* -------------------------------------------------------
       ACCEPTED
    ------------------------------------------------------- */

    if (status === "PHARMACY_ACCEPTED") {
      return (
        <Button
          size="small"
          variant="contained"
          startIcon={<Inventory2 />}
          disabled={saving}
          onClick={() => updateStatus(orderId, "PACKING")}
        >
          Start Packing
        </Button>
      );
    }

    /* -------------------------------------------------------
       PACKING
    ------------------------------------------------------- */

    if (status === "PACKING") {
      return (
        <Button
          size="small"
          variant="contained"
          color="success"
          startIcon={<ShoppingBag />}
          disabled={saving}
          onClick={() => updateStatus(orderId, "READY_FOR_PICKUP")}
        >
          Ready for Pickup
        </Button>
      );
    }

    /* -------------------------------------------------------
       READY
    ------------------------------------------------------- */

    if (status === "READY_FOR_PICKUP") {
      return (
        <Chip
          icon={<LocalShipping />}
          label="Waiting for Delivery"
          color="info"
          size="small"
        />
      );
    }

    /* -------------------------------------------------------
       DELIVERY ASSIGNED
    ------------------------------------------------------- */

    if (status === "DELIVERY_ASSIGNED") {
      return (
        <Chip
          icon={<LocalShipping />}
          label="Delivery Assigned"
          color="info"
          size="small"
        />
      );
    }

    /* -------------------------------------------------------
       PICKED UP / OUT FOR DELIVERY
    ------------------------------------------------------- */

    if (status === "PICKED_UP" || status === "OUT_FOR_DELIVERY") {
      return (
        <Chip
          icon={<LocalShipping />}
          label="Out for Delivery"
          color="primary"
          size="small"
        />
      );
    }

    /* -------------------------------------------------------
       DELIVERED
    ------------------------------------------------------- */

    if (status === "DELIVERED") {
      return (
        <Chip
          icon={<CheckCircle />}
          label="Completed"
          color="success"
          size="small"
        />
      );
    }

    /* -------------------------------------------------------
       DEFAULT
    ------------------------------------------------------- */

    return (
      <Chip
        label={STATUS_CONFIG[status]?.label || status || "Unknown"}
        color={STATUS_CONFIG[status]?.color || "default"}
        size="small"
      />
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

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
      {/* =====================================================
          HEADER
      ===================================================== */}

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
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Pharmacy Orders
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage incoming orders and prepare them for delivery.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchOrders}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <KpiCard title="Pending" value={pendingOrders} icon={<AccessTime />} />

        <KpiCard
          title="Processing"
          value={acceptedOrders}
          icon={<Inventory2 />}
        />

        <KpiCard
          title="Ready for Pickup"
          value={readyOrders}
          icon={<LocalShipping />}
        />

        <KpiCard
          title="Completed"
          value={completedOrders}
          icon={<CheckCircle />}
        />
      </Box>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: 2,
          mb: 3,
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
          placeholder="Search by order ID, customer name or phone..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color: "text.secondary",
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Paper>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box
            sx={{
              minHeight: 400,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "#f8fafc",
                    }}
                  >
                    <TableCell>
                      <b>Order</b>
                    </TableCell>

                    <TableCell>
                      <b>Customer</b>
                    </TableCell>

                    <TableCell>
                      <b>Items</b>
                    </TableCell>

                    <TableCell>
                      <b>Total</b>
                    </TableCell>

                    <TableCell>
                      <b>Status</b>
                    </TableCell>

                    <TableCell align="right">
                      <b>Actions</b>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Box sx={{ py: 8 }}>
                          <ShoppingBag
                            sx={{
                              fontSize: 50,
                              color: "text.disabled",
                              mb: 1,
                            }}
                          />

                          <Typography fontWeight={700}>
                            No orders found
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            New customer orders will appear here.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedOrders.map((order) => {
                      const status = STATUS_CONFIG[order.orderStatus] || {
                        label: order.orderStatus || "Unknown",
                        color: "default",
                      };

                      return (
                        <TableRow key={order._id} hover>
                          {/* ORDER */}

                          <TableCell>
                            <Typography fontWeight={700}>
                              #{order._id?.slice(-8).toUpperCase()}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleString()
                                : "-"}
                            </Typography>
                          </TableCell>

                          {/* CUSTOMER */}

                          <TableCell>
                            <Typography fontWeight={700}>
                              {order.customer?.name || "Customer"}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {order.customer?.phone ||
                                order.customer?.email ||
                                "-"}
                            </Typography>
                          </TableCell>

                          {/* ITEMS */}

                          <TableCell>
                            <Typography fontWeight={600}>
                              {order.items?.length || 0} item
                              {order.items?.length === 1 ? "" : "s"}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {order.items
                                ?.slice(0, 2)
                                .map((item) => item.name || item.medicine?.name)
                                .filter(Boolean)
                                .join(", ") || "Medicine order"}
                            </Typography>
                          </TableCell>

                          {/* TOTAL */}

                          <TableCell>
                            <Typography fontWeight={800}>
                              ₹{Number(order.totalAmount || 0).toFixed(2)}
                            </Typography>
                          </TableCell>

                          {/* STATUS */}

                          <TableCell>
                            <Chip
                              label={status.label}
                              color={status.color}
                              size="small"
                            />
                          </TableCell>

                          {/* ACTIONS */}

                          <TableCell align="right">
                            {renderActions(order)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider />

            <TablePagination
              component="div"
              count={filteredOrders.length}
              page={page}
              onPageChange={(event, newPage) => {
                setPage(newPage);
              }}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));

                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      {/* =====================================================
          SNACKBAR
      ===================================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({ title, value, icon }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>

          <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "primary.50",
            color: "primary.main",
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

export default PharmacyOrders;
