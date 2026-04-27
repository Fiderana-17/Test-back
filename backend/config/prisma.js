const { PrismaClient } = require("@prisma/client");

// Singleton — une seule instance dans toute l'app
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

module.exports = prisma;