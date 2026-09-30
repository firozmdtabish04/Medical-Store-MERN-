import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add,
  Delete,
  Edit,
  Inventory2,
  Refresh,
  Search,
  Close,
  Warning,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

import api from "../../services/api";

/* =========================================================
   STATUS CONFIG
========================================================= */

const STATUS_CONFIG = {
  AVAILABLE: {
    label: "Available",
    color: "success",
    icon: <CheckCircle fontSize="small" />,
  },

  LOW_STOCK: {
    label: "Low Stock",
    color: "warning",
    icon: <Warning fontSize="small" />,
  },

  OUT_OF_STOCK: {
    label: "Out of Stock",
    color: "error",
    icon: <Cancel fontSize="small" />,
  },
};

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
  medicine: "",
  price: "",
  discount: "",
  stock: "",
  lowStockThreshold: "10",
};

/* =========================================================
   COMPONENT
========================================================= */

function Inventory() {
  /* =======================================================
     STATE
  ======================================================= */

  const [medicines, setMedicines] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* =======================================================
     SNACKBAR
  ======================================================= */

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

  /* =======================================================
     LOAD MEDICINES
  ======================================================= */

  const fetchMedicines = async () => {
    try {
      const response = await api.get("/medicines");

      const data = response.data;

      setMedicines(
        Array.isArray(data?.medicines)
          ? data.medicines
          : Array.isArray(data)
            ? data
            : [],
      );
    } catch (error) {
      console.error("Failed to load medicines:", error);

      showMessage(
        error?.response?.data?.message || "Failed to load medicine master list",
        "error",
      );
    }
  };

  /* =======================================================
     LOAD INVENTORY
  ======================================================= */

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const response = await api.get("/medicines/inventory/my");

      const data = response.data;

      setInventory(
        Array.isArray(data?.inventory)
          ? data.inventory
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
              ? data
              : [],
      );
    } catch (error) {
      console.error("Failed to load inventory:", error);

      showMessage(
        error?.response?.data?.message || "Failed to load inventory",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchMedicines(), fetchInventory()]);
    };

    loadData();
  }, []);

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = async () => {
    await Promise.all([fetchMedicines(), fetchInventory()]);

    showMessage("Inventory refreshed");
  };

  /* =======================================================
     FORM HANDLER
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =======================================================
     OPEN ADD DIALOG
  ======================================================= */

  const handleAdd = () => {
    setEditingItem(null);

    setForm(initialForm);

    setOpenDialog(true);
  };

  /* =======================================================
     OPEN EDIT DIALOG
  ======================================================= */

  const handleEdit = (item) => {
    setEditingItem(item);

    setForm({
      medicine:
        item?.medicine?._id || item?.medicine?.id || item?.medicine || "",

      price: item?.price ?? "",

      discount: item?.discount ?? "",

      stock: item?.stock ?? "",

      lowStockThreshold: item?.lowStockThreshold ?? 10,
    });

    setOpenDialog(true);
  };

  /* =======================================================
     CLOSE DIALOG
  ======================================================= */

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
    setEditingItem(null);
    setForm(initialForm);
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    if (!editingItem && !form.medicine) {
      showMessage("Please select a medicine", "error");
      return false;
    }

    if (form.price === "" || Number(form.price) < 0) {
      showMessage("Enter a valid price", "error");
      return false;
    }

    if (
      form.discount === "" ||
      Number(form.discount) < 0 ||
      Number(form.discount) > 100
    ) {
      showMessage("Discount must be between 0 and 100", "error");
      return false;
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      showMessage("Enter a valid stock quantity", "error");
      return false;
    }

    if (form.lowStockThreshold === "" || Number(form.lowStockThreshold) < 0) {
      showMessage("Enter a valid low stock threshold", "error");
      return false;
    }

    return true;
  };

  /* =======================================================
     ADD / UPDATE INVENTORY
  ======================================================= */

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      if (editingItem) {
        await api.put(`/medicines/inventory/${editingItem._id}`, {
          price: Number(form.price),
          discount: Number(form.discount),
          stock: Number(form.stock),
          lowStockThreshold: Number(form.lowStockThreshold),
        });

        showMessage("Inventory updated successfully");
      } else {
        await api.post("/medicines/inventory", {
          medicineId: form.medicine, // ✅ FIXED
          price: Number(form.price),
          discount: Number(form.discount),
          stock: Number(form.stock),
          lowStockThreshold: Number(form.lowStockThreshold),
        });

        showMessage("Medicine added to your pharmacy inventory");
      }

      setOpenDialog(false);
      setEditingItem(null);
      setForm(initialForm);

      await fetchInventory();
    } catch (error) {
      console.error("Inventory save error:", error);
      console.error("Response:", error.response?.data);

      showMessage(
        error?.response?.data?.message || "Failed to save inventory",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteDialog(true);
  };

  const handleDeleteCancel = () => {
    setSelectedItem(null);
    setDeleteDialog(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    try {
      setSaving(true);

      await api.delete(`/medicines/inventory/${selectedItem._id}`);

      showMessage("Medicine removed from inventory");

      setSelectedItem(null);
      setDeleteDialog(false);

      await fetchInventory();
    } catch (error) {
      console.error("Delete inventory error:", error);

      showMessage(
        error?.response?.data?.message || "Failed to remove medicine",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     CALCULATE DISCOUNTED PRICE
  ======================================================= */

  const getSellingPrice = (price, discount) => {
    const originalPrice = Number(price || 0);
    const discountValue = Number(discount || 0);

    return originalPrice - (originalPrice * discountValue) / 100;
  };

  /* =======================================================
     FILTER INVENTORY
  ======================================================= */

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const medicine = item?.medicine;

      const medicineName = (medicine?.name || "").toLowerCase();

      const genericName = (medicine?.genericName || "").toLowerCase();

      const brandName = (medicine?.brandName || "").toLowerCase();

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        medicineName.includes(searchValue) ||
        genericName.includes(searchValue) ||
        brandName.includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inventory, search, statusFilter]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const paginatedInventory = filteredInventory.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  /* =======================================================
     SEARCH CHANGE
  ======================================================= */

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  /* =======================================================
     STATUS CHANGE
  ======================================================= */

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  /* =======================================================
     KPI
  ======================================================= */

  const totalItems = inventory.length;

  const availableItems = inventory.filter(
    (item) => item.status === "AVAILABLE",
  ).length;

  const lowStockItems = inventory.filter(
    (item) => item.status === "LOW_STOCK",
  ).length;

  const outOfStockItems = inventory.filter(
    (item) => item.status === "OUT_OF_STOCK",
  ).length;

  /* =======================================================
     RENDER
  ======================================================= */

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
      {/* ===================================================
          HEADER
      =================================================== */}

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
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Pharmacy Inventory
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage medicines, prices, discounts and pharmacy stock.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            Add Medicine
          </Button>
        </Box>
      </Box>

      {/* ===================================================
          KPI CARDS
      =================================================== */}

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
        <KpiCard
          title="Total Medicines"
          value={totalItems}
          icon={<Inventory2 />}
        />

        <KpiCard
          title="Available"
          value={availableItems}
          icon={<CheckCircle />}
        />

        <KpiCard title="Low Stock" value={lowStockItems} icon={<Warning />} />

        <KpiCard
          title="Out of Stock"
          value={outOfStockItems}
          icon={<Cancel />}
        />
      </Box>

      {/* ===================================================
          FILTER BAR
      =================================================== */}

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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 220px",
            },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            value={search}
            onChange={handleSearchChange}
            placeholder="Search medicine, generic name or brand..."
            size="small"
            slotProps={{
              htmlInput: {
                min: 0,
                step: "0.01",
              },
            }}
          />

          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>

            <Select
              value={statusFilter}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="ALL">All Status</MenuItem>

              <MenuItem value="AVAILABLE">Available</MenuItem>

              <MenuItem value="LOW_STOCK">Low Stock</MenuItem>

              <MenuItem value="OUT_OF_STOCK">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* ===================================================
          TABLE
      =================================================== */}

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
                      <b>Medicine</b>
                    </TableCell>

                    <TableCell>
                      <b>Category</b>
                    </TableCell>

                    <TableCell>
                      <b>Price</b>
                    </TableCell>

                    <TableCell>
                      <b>Discount</b>
                    </TableCell>

                    <TableCell>
                      <b>Selling Price</b>
                    </TableCell>

                    <TableCell>
                      <b>Stock</b>
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
                  {paginatedInventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Box
                          sx={{
                            py: 8,
                          }}
                        >
                          <Inventory2
                            sx={{
                              fontSize: 50,
                              color: "text.disabled",
                              mb: 1,
                            }}
                          />

                          <Typography fontWeight={700}>
                            No medicines found
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            Add a medicine to your pharmacy inventory.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedInventory.map((item) => {
                      const medicine = item?.medicine || {};

                      const sellingPrice = getSellingPrice(
                        item.price,
                        item.discount,
                      );

                      const status =
                        STATUS_CONFIG[item.status] || STATUS_CONFIG.AVAILABLE;

                      return (
                        <TableRow key={item._id} hover>
                          {/* MEDICINE */}

                          <TableCell>
                            <Box>
                              <Typography fontWeight={700}>
                                {medicine.name || "Unknown Medicine"}
                              </Typography>

                              {medicine.genericName && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {medicine.genericName}
                                </Typography>
                              )}

                              {medicine.brandName && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: "block",
                                  }}
                                >
                                  Brand: {medicine.brandName}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>

                          {/* CATEGORY */}

                          <TableCell>
                            <Chip
                              label={medicine.category || "General"}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>

                          {/* PRICE */}

                          <TableCell>
                            ₹{Number(item.price || 0).toFixed(2)}
                          </TableCell>

                          {/* DISCOUNT */}

                          <TableCell>{Number(item.discount || 0)}%</TableCell>

                          {/* SELLING PRICE */}

                          <TableCell>
                            <Typography fontWeight={800} color="success.main">
                              ₹{sellingPrice.toFixed(2)}
                            </Typography>
                          </TableCell>

                          {/* STOCK */}

                          <TableCell>
                            <Typography
                              fontWeight={700}
                              color={
                                item.stock <= item.lowStockThreshold
                                  ? "warning.main"
                                  : "text.primary"
                              }
                            >
                              {item.stock}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Threshold: {item.lowStockThreshold}
                            </Typography>
                          </TableCell>

                          {/* STATUS */}

                          <TableCell>
                            <Chip
                              icon={status.icon}
                              label={status.label}
                              color={status.color}
                              size="small"
                            />
                          </TableCell>

                          {/* ACTIONS */}

                          <TableCell align="right">
                            <Tooltip title="Edit">
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Remove">
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteClick(item)}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
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
              count={filteredInventory.length}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
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

      {/* ===================================================
          ADD / EDIT DIALOG
      =================================================== */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={800}>
                {editingItem ? "Edit Inventory" : "Add Medicine"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {editingItem
                  ? "Update your pharmacy stock details."
                  : "Add an existing medicine to your pharmacy."}
              </Typography>
            </Box>

            <IconButton onClick={handleCloseDialog} disabled={saving}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
              pt: 1,
            }}
          >
            {/* MEDICINE */}

            <Box
              sx={{
                gridColumn: {
                  xs: "span 1",
                  sm: "span 2",
                },
              }}
            >
              <FormControl
                fullWidth
                size="small"
                disabled={Boolean(editingItem)}
              >
                <InputLabel>Medicine</InputLabel>

                <Select
                  name="medicine"
                  value={form.medicine}
                  label="Medicine"
                  onChange={handleChange}
                >
                  <MenuItem value="">Select medicine</MenuItem>

                  {medicines.map((medicine) => (
                    <MenuItem key={medicine._id} value={medicine._id}>
                      {medicine.name}

                      {medicine.genericName ? ` — ${medicine.genericName}` : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* PRICE */}

            <TextField
              label="Price"
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              size="small"
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: "0.01",
                },
              }}
            />

            {/* DISCOUNT */}

            <TextField
              label="Discount (%)"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              type="number"
              size="small"
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 0,
                  max: 100,
                  step: "0.01",
                },
              }}
            />

            {/* STOCK */}

            <TextField
              label="Stock Quantity"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              type="number"
              size="small"
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 1,
                },
              }}
            />

            {/* LOW STOCK */}

            <TextField
              label="Low Stock Threshold"
              name="lowStockThreshold"
              value={form.lowStockThreshold}
              onChange={handleChange}
              type="number"
              size="small"
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 1,
                },
              }}
            />
          </Box>

          {/* PRICE PREVIEW */}

          {form.price !== "" && (
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "#f8fafc",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Customer selling price
              </Typography>

              <Typography variant="h5" fontWeight={800} color="success.main">
                ₹{getSellingPrice(form.price, form.discount).toFixed(2)}
              </Typography>
            </Paper>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
          }}
        >
          <Button onClick={handleCloseDialog} disabled={saving}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress size={18} color="inherit" />
              ) : editingItem ? (
                <Edit />
              ) : (
                <Add />
              )
            }
          >
            {saving ? "Saving..." : editingItem ? "Update" : "Add Medicine"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================
          DELETE DIALOG
      =================================================== */}

      <Dialog
        open={deleteDialog}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Remove Medicine</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to remove{" "}
            <strong>{selectedItem?.medicine?.name || "this medicine"}</strong>{" "}
            from your pharmacy inventory?
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This will remove the medicine from your pharmacy's inventory.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
          }}
        >
          <Button onClick={handleDeleteCancel} disabled={saving}>
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Delete />
              )
            }
          >
            {saving ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================
          SNACKBAR
      =================================================== */}

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

export default Inventory;
