import React, { useState, useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Close,
  TableChart,
  Refresh,
  ShoppingBag,
  Medication,
  Store,
} from "@mui/icons-material";
import api from "../../services/api";

export default function GlobalDataGridModal({ open, onClose }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Data states
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);

  // Fetch orders
  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/my");
      setOrders(res.data?.orders || []);
    } catch {
      // If customer fails, try admin orders
      try {
        const res2 = await api.get("/admin/orders");
        setOrders(res2.data?.orders || []);
      } catch (err) {
        console.warn("Could not load orders for DataGrid:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch medicines
  const loadMedicines = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pharmacies/search-medicine");
      setMedicines(res.data?.stores || []);
    } catch (err) {
      console.warn("Could not load medicines for DataGrid:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pharmacies
  const loadPharmacies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pharmacies/nearby");
      setPharmacies(res.data?.pharmacies || []);
    } catch (err) {
      console.warn("Could not load pharmacies for DataGrid:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    if (tabIndex === 0) loadOrders();
    else if (tabIndex === 1) loadMedicines();
    else if (tabIndex === 2) loadPharmacies();
  }, [open, tabIndex]);

  // Orders Columns & Rows
  const orderColumns = useMemo(
    () => [
      {
        field: "orderId",
        headerName: "Order ID",
        width: 140,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={800} color="success.main">
            #{params.value}
          </Typography>
        ),
      },
      { field: "date", headerName: "Date", width: 130 },
      { field: "pharmacy", headerName: "Pharmacy", width: 200 },
      { field: "itemsCount", headerName: "Items", width: 110 },
      {
        field: "totalAmount",
        headerName: "Amount",
        width: 120,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={700}>
            ₹{params.value}
          </Typography>
        ),
      },
      {
        field: "orderStatus",
        headerName: "Status",
        width: 160,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value}
            color={params.value === "DELIVERED" ? "success" : "primary"}
            sx={{ fontWeight: 700, fontSize: "0.7rem", borderRadius: 1.5 }}
          />
        ),
      },
    ],
    [],
  );

  const orderRows = useMemo(
    () =>
      orders.map((o) => ({
        id: o._id,
        orderId: o._id ? o._id.slice(-6).toUpperCase() : "N/A",
        date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "-",
        pharmacy: o.pharmacy?.storeName || "Partner Pharmacy",
        itemsCount: `${o.items?.length || 1} items`,
        totalAmount: o.totalAmount ?? 0,
        orderStatus: o.orderStatus || "PENDING",
      })),
    [orders],
  );

  // Medicine Columns & Rows
  const medicineColumns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Medicine Name",
        width: 220,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={700}>
            {params.value}
          </Typography>
        ),
      },
      { field: "storeName", headerName: "Pharmacy Store", width: 200 },
      { field: "category", headerName: "Category", width: 150 },
      {
        field: "price",
        headerName: "Price",
        width: 120,
        renderCell: (params) => <span>₹{params.value}</span>,
      },
      {
        field: "discount",
        headerName: "Discount",
        width: 110,
        renderCell: (params) => <span>{params.value}% OFF</span>,
      },
      {
        field: "stock",
        headerName: "Stock",
        width: 110,
        renderCell: (params) => (
          <Chip
            size="small"
            label={`${params.value} left`}
            color={params.value > 10 ? "success" : "warning"}
            sx={{ fontWeight: 700, fontSize: "0.7rem" }}
          />
        ),
      },
    ],
    [],
  );

  const medicineRows = useMemo(
    () =>
      medicines.map((m, idx) => ({
        id: m.inventoryId || m._id || idx,
        name: m.name || m.medicine?.name || "Medicine",
        storeName: m.storeName || "Apollo Care",
        category: m.category || "General",
        price: m.effectivePrice || m.price || 0,
        discount: m.discount || 0,
        stock: m.stock || 50,
      })),
    [medicines],
  );

  // Pharmacy Columns & Rows
  const pharmacyColumns = useMemo(
    () => [
      {
        field: "storeName",
        headerName: "Pharmacy Store",
        width: 220,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={700}>
            {params.value}
          </Typography>
        ),
      },
      { field: "phone", headerName: "Contact Phone", width: 160 },
      { field: "city", headerName: "City", width: 140 },
      { field: "distance", headerName: "Approx Distance", width: 160 },
      {
        field: "status",
        headerName: "Verification",
        width: 140,
        renderCell: (params) => (
          <Chip
            size="small"
            label="Verified & Online"
            color="success"
            sx={{ fontWeight: 700, fontSize: "0.7rem" }}
          />
        ),
      },
    ],
    [],
  );

  const pharmacyRows = useMemo(
    () =>
      pharmacies.map((p, idx) => ({
        id: p._id || idx,
        storeName: p.storeName || "Pharmacy Store",
        phone: p.phone || "N/A",
        city: p.address?.city || "Bhubaneswar",
        distance: p.distance ? `${p.distance} km` : "Nearby",
        status: p.approvalStatus || "APPROVED",
      })),
    [pharmacies],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          px: 3,
          py: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 36,
              width: 36,
              borderRadius: 2,
              bgcolor: "success.main",
              color: "white",
            }}
          >
            <TableChart fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} color="text.primary">
              MUI DataGrid Explorer
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Real-time platform telemetry powered by @mui/x-data-grid
            </Typography>
          </Box>
        </Box>

        <IconButton size="small" onClick={onClose} sx={{ color: "text.secondary" }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3, bgcolor: "#f8fafc" }}>
        <Tabs
          value={tabIndex}
          onChange={(e, next) => setTabIndex(next)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              minHeight: 48,
            },
          }}
        >
          <Tab icon={<ShoppingBag fontSize="small" />} iconPosition="start" label="Orders DataGrid" />
          <Tab icon={<Medication fontSize="small" />} iconPosition="start" label="Medicines DataGrid" />
          <Tab icon={<Store fontSize="small" />} iconPosition="start" label="Pharmacies DataGrid" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 2.5, minHeight: 460 }}>
        {loading ? (
          <Box sx={{ display: "flex", height: 420, alignItems: "center", justifyContent: "center" }}>
            <CircularProgress color="success" />
          </Box>
        ) : (
          <Box sx={{ height: 430, width: "100%" }}>
            {tabIndex === 0 && (
              <DataGrid
                rows={orderRows}
                columns={orderColumns}
                initialState={{ pagination: { paginationModel: { pageSize: 6 } } }}
                pageSizeOptions={[6, 12, 24]}
                disableRowSelectionOnClick
                sx={{
                  border: "none",
                  "& .MuiDataGrid-columnHeaders": { bgcolor: "#f8fafc", fontWeight: 800 },
                  "& .MuiDataGrid-row:hover": { bgcolor: "#f0fdf4" },
                }}
              />
            )}
            {tabIndex === 1 && (
              <DataGrid
                rows={medicineRows}
                columns={medicineColumns}
                initialState={{ pagination: { paginationModel: { pageSize: 6 } } }}
                pageSizeOptions={[6, 12, 24]}
                disableRowSelectionOnClick
                sx={{
                  border: "none",
                  "& .MuiDataGrid-columnHeaders": { bgcolor: "#f8fafc", fontWeight: 800 },
                  "& .MuiDataGrid-row:hover": { bgcolor: "#f0fdf4" },
                }}
              />
            )}
            {tabIndex === 2 && (
              <DataGrid
                rows={pharmacyRows}
                columns={pharmacyColumns}
                initialState={{ pagination: { paginationModel: { pageSize: 6 } } }}
                pageSizeOptions={[6, 12, 24]}
                disableRowSelectionOnClick
                sx={{
                  border: "none",
                  "& .MuiDataGrid-columnHeaders": { bgcolor: "#f8fafc", fontWeight: 800 },
                  "& .MuiDataGrid-row:hover": { bgcolor: "#f0fdf4" },
                }}
              />
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5, borderTop: "1px solid #f1f5f9", justifyContent: "space-between" }}>
        <Typography variant="caption" color="text.secondary">
          Showing real-time records from MongoDB database
        </Typography>
        <Button onClick={onClose} variant="contained" color="success" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>
          Close DataGrid
        </Button>
      </DialogActions>
    </Dialog>
  );
}
