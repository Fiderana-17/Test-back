const express = require("express");
const router  = express.Router();

const {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
} = require("../controller/listing.controller");

const { authenticate, authorize } = require("../middlewares/auth.middleware");
const upload                      = require("../middlewares/upload.middleware");

// ── Routes publiques (sans auth) ─────────────────────────────

// GET /api/listings?region=Sava&category=Fruits&q=riz
router.get("/", getAllListings);

// GET /api/listings/:id
router.get("/:id", getListingById);

// ── Routes protégées ─────────────────────────────────────────

// GET /api/listings/my — Mes annonces (producteur connecté)
router.get("/my/listings", authenticate, authorize("producteur"), getMyListings);

// POST /api/listings — Publier une annonce (producteur seulement)
router.post(
  "/",
  authenticate,
  authorize("producteur"),
  upload.single("image"),
  createListing
);

// PUT /api/listings/:id — Modifier une annonce
router.put(
  "/:id",
  authenticate,
  authorize("producteur", "admin"),
  upload.single("image"),
  updateListing
);

// DELETE /api/listings/:id — Retirer une annonce (soft delete)
router.delete("/:id", authenticate, authorize("producteur", "admin"), deleteListing);

module.exports = router;