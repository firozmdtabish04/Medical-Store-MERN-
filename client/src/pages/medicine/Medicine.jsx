import React, { useEffect, useMemo, useState } from "react";
import {
  Add,
  Search,
  Edit,
  Delete,
  Medication,
  Close,
  Refresh,
  Inventory2,
  LocalPharmacy,
  Vaccines,
  MoreVert,
  FilterList,
  ArrowForward,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import api from "../../services/api";

// ======================================================
// INITIAL FORM
// ======================================================

const initialForm = {
  name: "",
  genericName: "",
  brandName: "",
  category: "",
  dosage: "",
  description: "",
  image: "",
  prescriptionRequired: false,
};

// ======================================================
// MEDICINE COMPONENT
// ======================================================

function Medicine() {
  // ----------------------------------------------------
  // DATA
  // ----------------------------------------------------

  const [medicines, setMedicines] = useState([]);

  const [search, setSearch] = useState("");

  // ----------------------------------------------------
  // LOADING
  // ----------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ----------------------------------------------------
  // DIALOG
  // ----------------------------------------------------

  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  // ----------------------------------------------------
  // FORM
  // ----------------------------------------------------

  const [form, setForm] = useState(initialForm);

  // ----------------------------------------------------
  // DELETE CONFIRMATION
  // ----------------------------------------------------

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);

  // ----------------------------------------------------
  // SNACKBAR
  // ----------------------------------------------------

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ======================================================
  // SNACKBAR
  // ======================================================

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

  // ======================================================
  // GET ALL MEDICINES
  // ======================================================

  const fetchMedicines = async () => {
    try {
      setLoading(true);

      const response = await api.get("/medicines");

      setMedicines(response.data.medicines || []);
    } catch (error) {
      console.error("Failed to fetch medicines:", error);

      showMessage(
        error.response?.data?.message || "Failed to load medicines",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {
    setForm({
      ...initialForm,
    });

    setEditingMedicine(null);
  };

  // ======================================================
  // OPEN ADD MODAL
  // ======================================================

  const openAddModal = () => {
    resetForm();

    setShowModal(true);
  };

  // ======================================================
  // OPEN EDIT MODAL
  // ======================================================

  const openEditModal = (medicine) => {
    setEditingMedicine(medicine);

    setForm({
      name: medicine.name || "",
      genericName: medicine.genericName || "",
      brandName: medicine.brandName || "",
      category: medicine.category || "",
      dosage: medicine.dosage || "",
      description: medicine.description || "",
      image: medicine.image || "",
      prescriptionRequired: medicine.prescriptionRequired || false,
    });

    setShowModal(true);
  };

  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    resetForm();
  };

  // ======================================================
  // VALIDATION
  // ======================================================

  const validateForm = () => {
    if (!form.name.trim()) {
      showMessage("Medicine name is required", "error");

      return false;
    }

    if (!form.category.trim()) {
      showMessage("Category is required", "error");

      return false;
    }

    return true;
  };

  // ======================================================
  // CREATE / UPDATE MEDICINE
  // ======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      name: form.name.trim(),
      genericName: form.genericName.trim(),
      brandName: form.brandName.trim(),
      category: form.category.trim(),
      dosage: form.dosage.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      prescriptionRequired: form.prescriptionRequired,
    };

    try {
      setSaving(true);

      // -----------------------------------------------
      // UPDATE
      // -----------------------------------------------

      if (editingMedicine) {
        await api.put(`/medicines/${editingMedicine._id}`, payload);

        showMessage("Medicine updated successfully");
      }

      // -----------------------------------------------
      // CREATE
      // -----------------------------------------------
      else {
        await api.post("/medicines", payload);

        showMessage("Medicine created successfully");
      }

      setShowModal(false);

      resetForm();

      await fetchMedicines();
    } catch (error) {
      console.error("Medicine save error:", error);

      showMessage(
        error.response?.data?.message || "Failed to save medicine",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // OPEN DELETE DIALOG
  // ======================================================

  const openDeleteDialog = (medicine) => {
    setMedicineToDelete(medicine);

    setDeleteDialog(true);
  };

  // ======================================================
  // CLOSE DELETE DIALOG
  // ======================================================

  const closeDeleteDialog = () => {
    if (deleting) {
      return;
    }

    setDeleteDialog(false);

    setMedicineToDelete(null);
  };

  // ======================================================
  // DELETE / DEACTIVATE MEDICINE
  // ======================================================

  const handleDelete = async () => {
    if (!medicineToDelete?._id) {
      return;
    }

    try {
      setDeleting(true);

      await api.delete(`/medicines/${medicineToDelete._id}`);

      showMessage("Medicine deactivated successfully");

      closeDeleteDialog();

      await fetchMedicines();
    } catch (error) {
      console.error("Delete medicine error:", error);

      showMessage(
        error.response?.data?.message || "Failed to deactivate medicine",
        "error",
      );
    } finally {
      setDeleting(false);
    }
  };

  // ======================================================
  // SEARCH
  // ======================================================

  const filteredMedicines = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return medicines;
    }

    return medicines.filter((medicine) => {
      return (
        medicine.name?.toLowerCase().includes(query) ||
        medicine.genericName?.toLowerCase().includes(query) ||
        medicine.brandName?.toLowerCase().includes(query) ||
        medicine.category?.toLowerCase().includes(query)
      );
    });
  }, [medicines, search]);

  // ======================================================
  // STATS
  // ======================================================

  const totalMedicines = medicines.length;

  const activeMedicines = medicines.filter(
    (medicine) => medicine.isActive,
  ).length;

  const prescriptionMedicines = medicines.filter(
    (medicine) => medicine.prescriptionRequired,
  ).length;

  // ======================================================
  // RENDER
  // ======================================================

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
      {/* =====================================================
        PAGE HEADER
    ===================================================== */}

      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(25,118,210,0.22)",
            }}
          >
            <Medication sx={{ fontSize: 28 }} />
          </Box>

          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.5px",
              }}
            >
              Medicine Management
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mt: 0.3,
              }}
            >
              Manage medicine master, prescriptions and availability
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh medicines">
            <IconButton
              onClick={fetchMedicines}
              disabled={loading}
              sx={{
                width: 42,
                height: 42,
                border: "1px solid #e2e8f0",
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#f1f5f9",
                },
              }}
            >
              <Refresh
                sx={{
                  animation: loading ? "spin 1s linear infinite" : "none",
                }}
              />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddModal}
            sx={{
              height: 42,
              px: 2.5,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "0 6px 16px rgba(25,118,210,0.25)",
            }}
          >
            Add Medicine
          </Button>
        </Stack>
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
        {/* TOTAL */}

        <Card
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            background: "linear-gradient(135deg,#ffffff 0%,#f8fbff 100%)",
            transition: "0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            },
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  Total Medicines
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  {totalMedicines}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "#94a3b8",
                  }}
                >
                  Medicine master
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                }}
              >
                <Inventory2 />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* ACTIVE */}

        <Card
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            background: "linear-gradient(135deg,#ffffff 0%,#f5fff9 100%)",
            transition: "0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            },
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  Active Medicines
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    fontWeight: 800,
                    color: "#16a34a",
                  }}
                >
                  {activeMedicines}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "#94a3b8",
                  }}
                >
                  Currently available
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ecfdf5",
                  color: "#16a34a",
                }}
              >
                <LocalPharmacy />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* PRESCRIPTION */}

        <Card
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            background: "linear-gradient(135deg,#ffffff 0%,#fffaf2 100%)",
            transition: "0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            },
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  Prescription
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    fontWeight: 800,
                    color: "#ea580c",
                  }}
                >
                  {prescriptionMedicines}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "#94a3b8",
                  }}
                >
                  Require prescription
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff7ed",
                  color: "#ea580c",
                }}
              >
                <Vaccines />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* SEARCH RESULT */}

        <Card
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#fff",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontWeight: 600,
              }}
            >
              Search Results
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 1,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              {filteredMedicines.length}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "#94a3b8",
              }}
            >
              Matching medicines
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* =====================================================
        SEARCH / FILTER TOOLBAR
    ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          mb: 2,
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#fff",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={1.5}
          alignItems={{
            xs: "stretch",
            md: "center",
          }}
        >
          <TextField
            fullWidth
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by medicine, generic name, brand or category..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color: "#94a3b8",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
              },
            }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{
              minWidth: 120,
              height: 40,
              borderRadius: "10px",
              textTransform: "none",
              color: "#475569",
              borderColor: "#e2e8f0",
            }}
          >
            Filters
          </Button>
        </Stack>
      </Paper>

      {/* =====================================================
        TABLE
    ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        {/* TABLE HEADER */}

        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 750,
                color: "#0f172a",
              }}
            >
              Medicine Catalogue
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "#94a3b8",
              }}
            >
              Manage your medicine master records
            </Typography>
          </Box>

          <Chip
            label={`${filteredMedicines.length} records`}
            size="small"
            sx={{
              borderRadius: "7px",
              backgroundColor: "#eff6ff",
              color: "#2563eb",
              fontWeight: 700,
            }}
          />
        </Box>

        <TableContainer>
          <Table
            sx={{
              minWidth: 1050,
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f8fafc",
                }}
              >
                {[
                  "Medicine",
                  "Generic",
                  "Brand",
                  "Category",
                  "Dosage",
                  "Prescription",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    align={heading === "Actions" ? "right" : "left"}
                    sx={{
                      py: 1.8,
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "#64748b",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* LOADING */}

              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{
                      py: 10,
                      borderBottom: 0,
                    }}
                  >
                    <CircularProgress size={30} thickness={4} />

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 2,
                        color: "#64748b",
                      }}
                    >
                      Loading medicine catalogue...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {/* EMPTY */}

              {!loading && filteredMedicines.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{
                      py: 10,
                      borderBottom: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "18px",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#eff6ff",
                        color: "#2563eb",
                      }}
                    >
                      <Medication
                        sx={{
                          fontSize: 30,
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        mt: 2,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      No medicines found
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.5,
                        color: "#94a3b8",
                      }}
                    >
                      Try another search or add a new medicine.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {/* DATA */}

              {!loading &&
                filteredMedicines.map((medicine) => (
                  <TableRow
                    key={medicine._id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },

                      "& td": {
                        borderBottom: "1px solid #f1f5f9",
                      },
                    }}
                  >
                    {/* MEDICINE */}

                    <TableCell
                      sx={{
                        py: 1.8,
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "12px",
                            overflow: "hidden",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              "linear-gradient(135deg,#eff6ff,#dbeafe)",
                            color: "#2563eb",
                            border: "1px solid #dbeafe",
                          }}
                        >
                          {medicine.image ? (
                            <Box
                              component="img"
                              src={medicine.image}
                              alt={medicine.name}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <Medication />
                          )}
                        </Box>

                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "#0f172a",
                              fontSize: "0.9rem",
                            }}
                          >
                            {medicine.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              color: "#94a3b8",
                              fontFamily: "monospace",
                            }}
                          >
                            ID: {medicine._id?.slice(-8)}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* GENERIC */}

                    <TableCell
                      sx={{
                        color: "#475569",
                        fontSize: "0.85rem",
                      }}
                    >
                      {medicine.genericName || "-"}
                    </TableCell>

                    {/* BRAND */}

                    <TableCell
                      sx={{
                        color: "#475569",
                        fontSize: "0.85rem",
                      }}
                    >
                      {medicine.brandName || "-"}
                    </TableCell>

                    {/* CATEGORY */}

                    <TableCell>
                      <Chip
                        label={medicine.category || "-"}
                        size="small"
                        sx={{
                          height: 26,
                          borderRadius: "7px",
                          backgroundColor: "#f1f5f9",
                          color: "#475569",
                          fontWeight: 600,
                          fontSize: "0.72rem",
                        }}
                      />
                    </TableCell>

                    {/* DOSAGE */}

                    <TableCell
                      sx={{
                        color: "#475569",
                        fontSize: "0.85rem",
                      }}
                    >
                      {medicine.dosage || "-"}
                    </TableCell>

                    {/* PRESCRIPTION */}

                    <TableCell>
                      <Chip
                        label={
                          medicine.prescriptionRequired
                            ? "Required"
                            : "Not Required"
                        }
                        size="small"
                        sx={{
                          height: 26,
                          borderRadius: "7px",
                          fontWeight: 700,
                          backgroundColor: medicine.prescriptionRequired
                            ? "#fff7ed"
                            : "#ecfdf5",
                          color: medicine.prescriptionRequired
                            ? "#c2410c"
                            : "#15803d",
                        }}
                      />
                    </TableCell>

                    {/* STATUS */}

                    <TableCell>
                      <Stack direction="row" spacing={0.7} alignItems="center">
                        <Box
                          sx={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            backgroundColor: medicine.isActive
                              ? "#16a34a"
                              : "#ef4444",
                          }}
                        />

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: medicine.isActive ? "#15803d" : "#dc2626",
                          }}
                        >
                          {medicine.isActive ? "Active" : "Inactive"}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* ACTIONS */}

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Edit medicine">
                          <IconButton
                            size="small"
                            onClick={() => openEditModal(medicine)}
                            sx={{
                              width: 34,
                              height: 34,
                              color: "#2563eb",
                              backgroundColor: "#eff6ff",
                              borderRadius: "8px",
                              "&:hover": {
                                backgroundColor: "#dbeafe",
                              },
                            }}
                          >
                            <Edit
                              sx={{
                                fontSize: 18,
                              }}
                            />
                          </IconButton>
                        </Tooltip>

                        {medicine.isActive && (
                          <Tooltip title="Deactivate medicine">
                            <IconButton
                              size="small"
                              onClick={() => openDeleteDialog(medicine)}
                              sx={{
                                width: 34,
                                height: 34,
                                color: "#dc2626",
                                backgroundColor: "#fef2f2",
                                borderRadius: "8px",
                                "&:hover": {
                                  backgroundColor: "#fee2e2",
                                },
                              }}
                            >
                              <Delete
                                sx={{
                                  fontSize: 18,
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* =====================================================
        ADD / EDIT DIALOG
    ===================================================== */}

      <Dialog
        open={showModal}
        onClose={saving ? undefined : closeModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "18px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 3,
            py: 2.5,
            background: "linear-gradient(135deg,#f8fbff,#ffffff)",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                }}
              >
                {editingMedicine ? <Edit /> : <Add />}
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  {editingMedicine ? "Edit Medicine" : "Add Medicine"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {editingMedicine
                    ? "Update medicine details"
                    : "Create a new medicine master"}
                </Typography>
              </Box>
            </Stack>

            <IconButton onClick={closeModal} disabled={saving}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ p: 3 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            id="medicine-form"
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              label="Medicine Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              placeholder="Paracetamol"
            />

            <TextField
              label="Generic Name"
              name="genericName"
              value={form.genericName}
              onChange={handleChange}
              fullWidth
              placeholder="Acetaminophen"
            />

            <TextField
              label="Brand Name"
              name="brandName"
              value={form.brandName}
              onChange={handleChange}
              fullWidth
              placeholder="Crocin"
            />

            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              fullWidth
              placeholder="Pain Relief"
            />

            <TextField
              label="Dosage"
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              fullWidth
              placeholder="500mg"
            />

            <TextField
              label="Image URL"
              name="image"
              value={form.image}
              onChange={handleChange}
              fullWidth
              placeholder="https://..."
            />

            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              placeholder="Medicine description..."
              sx={{
                gridColumn: {
                  xs: "auto",
                  sm: "1 / -1",
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="prescriptionRequired"
                  checked={form.prescriptionRequired}
                  onChange={handleChange}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={700}>
                    Prescription Required
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Customer must provide a valid prescription.
                  </Typography>
                </Box>
              }
            />
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{
            p: 2,
            backgroundColor: "#f8fafc",
          }}
        >
          <Button
            onClick={closeModal}
            disabled={saving}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="medicine-form"
            variant="contained"
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress size={17} color="inherit" />
              ) : editingMedicine ? (
                <Edit />
              ) : (
                <Add />
              )
            }
            sx={{
              px: 2.5,
              borderRadius: "9px",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {saving
              ? editingMedicine
                ? "Updating..."
                : "Creating..."
              : editingMedicine
                ? "Update Medicine"
                : "Create Medicine"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
        DELETE DIALOG
    ===================================================== */}

      <Dialog
        open={deleteDialog}
        onClose={deleting ? undefined : closeDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "18px",
          },
        }}
      >
        <DialogTitle>Deactivate Medicine</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to deactivate{" "}
            <strong>{medicineToDelete?.name}</strong>?
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={1}>
            This medicine will no longer be active, but its database record will
            be preserved.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={closeDeleteDialog}
            disabled={deleting}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress size={17} color="inherit" />
              ) : (
                <Delete />
              )
            }
            sx={{
              borderRadius: "9px",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {deleting ? "Deactivating..." : "Deactivate"}
          </Button>
        </DialogActions>
      </Dialog>

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
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* =====================================================
        ANIMATION
    ===================================================== */}

      <style>
        {`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}
      </style>
    </Box>
  );
}

export default Medicine;
