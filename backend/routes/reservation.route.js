const express = require("express");
const router  = express.Router();

const {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
} = require("../controller/reservation.controller");

const { authenticate, authorize } = require("../middlewares/auth.middleware");

// Toutes les routes réservation sont protégées
router.use(authenticate);

// GET /api/reservations — Liste (filtrée selon le rôle)
router.get("/", getAllReservations);

// GET /api/reservations/:id — Détail d'une réservation
router.get("/:id", getReservationById);

// POST /api/reservations — Créer une réservation (acheteur seulement)
router.post("/", authorize("acheteur"), createReservation);

// PATCH /api/reservations/:id/status — Changer le statut
// Accessible au producteur (accept/reject) et à l'admin
router.patch(
  "/:id/status",
  authorize("producteur", "admin", "transporteur"),
  updateReservationStatus
);

module.exports = router;