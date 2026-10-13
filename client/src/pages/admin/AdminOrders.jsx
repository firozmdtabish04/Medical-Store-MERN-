import React, { useState, useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, Typography, Button } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import api from "../../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "ALL") params.status = statusFilter;
      const res = await api.get("/admin/orders", { params });
      setOrders(res.data?.orders || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const columns = useMemo(
    () => [
      {
        field: "orderId",
        headerName: "Order ID",
        width: 140,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={800} color="primary.main">
            #{params.value}
          </Typography>
        ),
      },
      {
        field: "customerName",
        headerName: "Customer",
        width: 180,
        renderCell: (params) => (
          <div>
            <p className="font-semibold text-gray-900 leading-tight">
              {params.value}
            </p>
            <p className="text-[11px] text-gray-400">
              {params.row.customerPhone}
            </p>
          </div>
        ),
      },
      {
        field: "pharmacyName",
        headerName: "Pharmacy",
        width: 200,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            {params.value}
          </Typography>
        ),
      },
      {
        field: "deliveryPartner",
        headerName: "Delivery Rider",
        width: 160,
        renderCell: (params) => (
          <span className="text-xs font-medium text-gray-600">
            {params.value || "Unassigned"}
          </span>
        ),
      },
      {
        field: "totalAmount",
        headerName: "Amount",
        width: 120,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={800} color="success.main">
            ₹{params.value}
          </Typography>
        ),
      },
      {
        field: "paymentStatus",
        headerName: "Payment",
        width: 130,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value}
            color={params.value === "SUCCESS" ? "success" : "warning"}
            sx={{ fontWeight: 700, fontSize: "0.7rem", borderRadius: 1.5 }}
          />
        ),
      },
      {
        field: "orderStatus",
        headerName: "Order Status",
        width: 170,
        renderCell: (params) => {
          const st = params.value;
          const isDelivered = st === "DELIVERED";
          const isCancelled = st === "CANCELLED" || st === "REJECTED";
          return (
            <Chip
              size="small"
              label={st.replace(/_/g, " ")}
              color={
                isDelivered ? "success" : isCancelled ? "error" : "primary"
              }
              sx={{ fontWeight: 700, fontSize: "0.7rem", borderRadius: 1.5 }}
            />
          );
        },
      },
      {
        field: "date",
        headerName: "Placed Date",
        width: 140,
      },
    ],
    [],
  );

  const rows = useMemo(() => {
    return orders.map((o) => ({
      id: o._id,
      orderId: o._id ? o._id.slice(-6).toUpperCase() : "N/A",
      customerName: o.customer?.name || "Customer",
      customerPhone: o.customer?.phone || "N/A",
      pharmacyName: o.pharmacy?.storeName || "Pharmacy",
      deliveryPartner: o.deliveryPartner?.name || "Unassigned",
      totalAmount: o.totalAmount ?? 0,
      paymentStatus: o.paymentStatus || "PENDING",
      orderStatus: o.orderStatus || "PENDING",
      date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "-",
    }));
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Platform Orders Monitor
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time track of all platform customer orders powered by MUI
            DataGrid.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1 rounded-2xl bg-gray-100 p-1">
            {[
              "ALL",
              "PENDING",
              "PACKING",
              "READY_FOR_PICKUP",
              "OUT_FOR_DELIVERY",
              "DELIVERED",
            ].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-3 py-1 text-[11px] font-bold transition ${
                  statusFilter === st
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {st.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <Button
            size="small"
            variant="outlined"
            onClick={fetchOrders}
            startIcon={<Refresh />}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
          >
            Refresh
          </Button>
        </div>
      </div>

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
            pageSizeOptions={[5, 10, 20, 50]}
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
