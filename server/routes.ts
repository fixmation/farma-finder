import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertLabBookingSchema, insertPharmacyDetailsSchema, insertLaboratoryDetailsSchema, insertProfileSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes for the lab booking application
  
  // Profile routes
  app.post("/api/profiles", async (req, res) => {
    try {
      const data = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(data);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  app.get("/api/profiles", async (req, res) => {
    try {
      const profiles = await storage.listProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profiles" });
    }
  });

  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Pharmacy routes
  app.get("/api/pharmacies", async (req, res) => {
    try {
      const pharmacies = await storage.listPharmacies();
      res.json(pharmacies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pharmacies" });
    }
  });

  // Prescription upload route
  app.post("/api/prescriptions/upload", async (req, res) => {
    try {
      // For now, just return success without actual file processing
      // In a real implementation, this would handle file upload to cloud storage
      // and create database records
      res.json({ 
        success: true, 
        message: "Prescription uploaded successfully",
        prescriptionId: `prescription_${Date.now()}`
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload prescription" });
    }
  });

  // Laboratory routes
  app.post("/api/laboratories", async (req, res) => {
    try {
      const data = insertLaboratoryDetailsSchema.parse(req.body);
      const laboratory = await storage.createLaboratoryDetails(data);
      res.json(laboratory);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  app.get("/api/laboratories", async (req, res) => {
    try {
      const laboratories = await storage.listLaboratories();
      res.json(laboratories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch laboratories" });
    }
  });

  app.get("/api/laboratories/:id", async (req, res) => {
    try {
      const laboratory = await storage.getLaboratoryDetails(req.params.id);
      if (!laboratory) {
        return res.status(404).json({ error: "Laboratory not found" });
      }
      res.json(laboratory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch laboratory" });
    }
  });

  // Lab booking routes
  app.post("/api/lab-bookings", async (req, res) => {
    try {
      const data = insertLabBookingSchema.parse(req.body);
      const booking = await storage.createLabBooking(data);
      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  app.get("/api/lab-bookings", async (req, res) => {
    try {
      const bookings = await storage.listLabBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lab bookings" });
    }
  });

  app.get("/api/lab-bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getLabBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Lab booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lab booking" });
    }
  });

  app.put("/api/lab-bookings/:id", async (req, res) => {
    try {
      const updates = req.body;
      const booking = await storage.updateLabBooking(req.params.id, updates);
      if (!booking) {
        return res.status(404).json({ error: "Lab booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  app.delete("/api/lab-bookings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLabBooking(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Lab booking not found" });
      }
      res.json({ message: "Lab booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete lab booking" });
    }
  });

  // Get lab bookings by laboratory
  app.get("/api/laboratories/:laboratoryId/bookings", async (req, res) => {
    try {
      const bookings = await storage.getLabBookingsByLaboratory(req.params.laboratoryId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lab bookings" });
    }
  });

  // Pharmacy routes
  app.post("/api/pharmacies", async (req, res) => {
    try {
      const data = insertPharmacyDetailsSchema.parse(req.body);
      const pharmacy = await storage.createPharmacyDetails(data);
      res.json(pharmacy);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  app.get("/api/pharmacies", async (req, res) => {
    try {
      const pharmacies = await storage.listPharmacies();
      res.json(pharmacies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pharmacies" });
    }
  });

  // Mapbox token endpoint (replaces Supabase Edge Function)
  app.get("/api/mapbox-token", async (req, res) => {
    try {
      // First try to get from site_config table
      const configResult = await storage.listCommissionTransactions(); // We'll use this as a placeholder
      // For now, return the environment variable
      const token = process.env.VITE_MAPBOX_TOKEN || null;
      res.json({ token });
    } catch (error) {
      console.error('Error fetching Mapbox token:', error);
      res.json({ token: null, error: 'Token not configured' });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
