const prisma = require("../config/prisma");

// ─── GET /api/users — Admin seulement ──────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, phone: true, avatarUrl: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ─── GET /api/users/:id ─────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, name: true, email: true, role: true, phone: true, avatarUrl: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ─── PUT /api/users/:id ─────────────────────────────────────
const updateUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(name  && { name: name.trim() }),
        ...(email && { email: email.toLowerCase().trim() }),
        ...(phone && { phone }),
      },
      select: { id: true, name: true, email: true, role: true, phone: true, avatarUrl: true },
    });

    return res.json({ message: "Profil mis à jour", user });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Utilisateur introuvable" });
    return res.status(500).json({ error: err.message });
  }
};

// ─── DELETE /api/users/:id — Admin seulement ───────────────
const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    return res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Utilisateur introuvable" });
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };