const express = require("express");
const router  = express.Router();

const {
  getAllDeliveries,
  getDeliveryById,
  acceptDelivery,
  advanceDelivery,
} = require("../controller/delivery.controller");

const { authenticate, authorize } = require("../middlewares/auth.middleware");

// Toutes les routes livraison sont protégées
router.use(authenticate);

// GET /api/deliveries — Liste (filtrée selon le rôle)
router.get("/", getAllDeliveries);

// GET /api/deliveries/:id — Détail d'une livraison
router.get("/:id", getDeliveryById);

// PATCH /api/deliveries/:id/accept — Transporteur accepte la mission
router.patch("/:id/accept", authorize("transporteur"), acceptDelivery);

// PATCH /api/deliveries/:id/advance — Avancer le statut (in_transit → delivered)
router.patch("/:id/advance", authorize("transporteur", "admin"), advanceDelivery);

module.exports = router;