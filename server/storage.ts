import { db } from "./db";
import { 
  profiles, 
  pharmacyDetails, 
  laboratoryDetails, 
  labBookings, 
  commissionTransactions, 
  prescriptions, 
  prescriptionMedications,
  users,
  type Profile,
  type PharmacyDetails,
  type LaboratoryDetails,
  type LabBooking,
  type CommissionTransaction,
  type Prescription,
  type PrescriptionMedication,
  type InsertProfile,
  type InsertPharmacyDetails,
  type InsertLaboratoryDetails,
  type InsertLabBooking,
  type InsertCommissionTransaction,
  type InsertPrescription,
  type InsertPrescriptionMedication,
  type User,
  type InsertUser
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

// Database storage interface
export interface IStorage {
  // Users (legacy support)
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  updateUser(id: number, updates: Partial<User>): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
  listUsers(): Promise<User[]>;

  // Profiles
  createProfile(profile: InsertProfile): Promise<Profile>;
  getProfile(id: string): Promise<Profile | null>;
  getProfileByEmail(email: string): Promise<Profile | null>;
  updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null>;
  listProfiles(): Promise<Profile[]>;

  // Pharmacy Details
  createPharmacyDetails(pharmacy: InsertPharmacyDetails): Promise<PharmacyDetails>;
  getPharmacyDetails(id: string): Promise<PharmacyDetails | null>;
  getPharmacyByUserId(userId: string): Promise<PharmacyDetails | null>;
  updatePharmacyDetails(id: string, updates: Partial<PharmacyDetails>): Promise<PharmacyDetails | null>;
  listPharmacies(): Promise<PharmacyDetails[]>;

  // Laboratory Details
  createLaboratoryDetails(laboratory: InsertLaboratoryDetails): Promise<LaboratoryDetails>;
  getLaboratoryDetails(id: string): Promise<LaboratoryDetails | null>;
  getLaboratoryByUserId(userId: string): Promise<LaboratoryDetails | null>;
  updateLaboratoryDetails(id: string, updates: Partial<LaboratoryDetails>): Promise<LaboratoryDetails | null>;
  listLaboratories(): Promise<LaboratoryDetails[]>;

  // Lab Bookings
  createLabBooking(booking: InsertLabBooking): Promise<LabBooking>;
  getLabBooking(id: string): Promise<LabBooking | null>;
  getLabBookingsByLaboratory(laboratoryId: string): Promise<LabBooking[]>;
  updateLabBooking(id: string, updates: Partial<LabBooking>): Promise<LabBooking | null>;
  deleteLabBooking(id: string): Promise<boolean>;
  listLabBookings(): Promise<LabBooking[]>;

  // Commission Transactions
  createCommissionTransaction(transaction: InsertCommissionTransaction): Promise<CommissionTransaction>;
  getCommissionTransaction(id: string): Promise<CommissionTransaction | null>;
  getCommissionTransactionsByPharmacy(pharmacyId: string): Promise<CommissionTransaction[]>;
  getCommissionTransactionsByLaboratory(laboratoryId: string): Promise<CommissionTransaction[]>;
  listCommissionTransactions(): Promise<CommissionTransaction[]>;

  // Prescriptions
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  getPrescription(id: string): Promise<Prescription | null>;
  getPrescriptionsByCustomer(customerId: string): Promise<Prescription[]>;
  getPrescriptionsByPharmacy(pharmacyId: string): Promise<Prescription[]>;
  updatePrescription(id: string, updates: Partial<Prescription>): Promise<Prescription | null>;
  listPrescriptions(): Promise<Prescription[]>;

  // Prescription Medications
  createPrescriptionMedication(medication: InsertPrescriptionMedication): Promise<PrescriptionMedication>;
  getPrescriptionMedication(id: string): Promise<PrescriptionMedication | null>;
  getPrescriptionMedicationsByPrescription(prescriptionId: string): Promise<PrescriptionMedication[]>;
  updatePrescriptionMedication(id: string, updates: Partial<PrescriptionMedication>): Promise<PrescriptionMedication | null>;
  deletePrescriptionMedication(id: string): Promise<boolean>;
}

class DatabaseStorage implements IStorage {
  // Users (legacy support)
  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0] || null;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async listUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Profiles
  async createProfile(profile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(profile as any).returning();
    return result[0];
  }

  async getProfile(id: string): Promise<Profile | null> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0] || null;
  }

  async getProfileByEmail(email: string): Promise<Profile | null> {
    const result = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
    return result[0] || null;
  }

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    const result = await db.update(profiles).set(updates).where(eq(profiles.id, id)).returning();
    return result[0] || null;
  }

  async listProfiles(): Promise<Profile[]> {
    return await db.select().from(profiles);
  }

  // Pharmacy Details
  async createPharmacyDetails(pharmacy: InsertPharmacyDetails): Promise<PharmacyDetails> {
    const result = await db.insert(pharmacyDetails).values(pharmacy).returning();
    return result[0];
  }

  async getPharmacyDetails(id: string): Promise<PharmacyDetails | null> {
    const result = await db.select().from(pharmacyDetails).where(eq(pharmacyDetails.id, id)).limit(1);
    return result[0] || null;
  }

  async getPharmacyByUserId(userId: string): Promise<PharmacyDetails | null> {
    const result = await db.select().from(pharmacyDetails).where(eq(pharmacyDetails.userId, userId)).limit(1);
    return result[0] || null;
  }

  async updatePharmacyDetails(id: string, updates: Partial<PharmacyDetails>): Promise<PharmacyDetails | null> {
    const result = await db.update(pharmacyDetails).set(updates).where(eq(pharmacyDetails.id, id)).returning();
    return result[0] || null;
  }

  async listPharmacies(): Promise<PharmacyDetails[]> {
    return await db.select().from(pharmacyDetails);
  }

  // Laboratory Details
  async createLaboratoryDetails(laboratory: InsertLaboratoryDetails): Promise<LaboratoryDetails> {
    const result = await db.insert(laboratoryDetails).values(laboratory).returning();
    return result[0];
  }

  async getLaboratoryDetails(id: string): Promise<LaboratoryDetails | null> {
    const result = await db.select().from(laboratoryDetails).where(eq(laboratoryDetails.id, id)).limit(1);
    return result[0] || null;
  }

  async getLaboratoryByUserId(userId: string): Promise<LaboratoryDetails | null> {
    const result = await db.select().from(laboratoryDetails).where(eq(laboratoryDetails.userId, userId)).limit(1);
    return result[0] || null;
  }

  async updateLaboratoryDetails(id: string, updates: Partial<LaboratoryDetails>): Promise<LaboratoryDetails | null> {
    const result = await db.update(laboratoryDetails).set(updates).where(eq(laboratoryDetails.id, id)).returning();
    return result[0] || null;
  }

  async listLaboratories(): Promise<LaboratoryDetails[]> {
    return await db.select().from(laboratoryDetails);
  }

  // Lab Bookings
  async createLabBooking(booking: InsertLabBooking): Promise<LabBooking> {
    const result = await db.insert(labBookings).values(booking).returning();
    return result[0];
  }

  async getLabBooking(id: string): Promise<LabBooking | null> {
    const result = await db.select().from(labBookings).where(eq(labBookings.id, id)).limit(1);
    return result[0] || null;
  }

  async getLabBookingsByLaboratory(laboratoryId: string): Promise<LabBooking[]> {
    return await db.select().from(labBookings).where(eq(labBookings.laboratoryId, laboratoryId)).orderBy(desc(labBookings.createdAt));
  }

  async updateLabBooking(id: string, updates: Partial<LabBooking>): Promise<LabBooking | null> {
    const result = await db.update(labBookings).set(updates).where(eq(labBookings.id, id)).returning();
    return result[0] || null;
  }

  async deleteLabBooking(id: string): Promise<boolean> {
    const result = await db.delete(labBookings).where(eq(labBookings.id, id)).returning();
    return result.length > 0;
  }

  async listLabBookings(): Promise<LabBooking[]> {
    return await db.select().from(labBookings).orderBy(desc(labBookings.createdAt));
  }

  // Commission Transactions
  async createCommissionTransaction(transaction: InsertCommissionTransaction): Promise<CommissionTransaction> {
    const result = await db.insert(commissionTransactions).values(transaction as any).returning();
    return result[0];
  }

  async getCommissionTransaction(id: string): Promise<CommissionTransaction | null> {
    const result = await db.select().from(commissionTransactions).where(eq(commissionTransactions.id, id)).limit(1);
    return result[0] || null;
  }

  async getCommissionTransactionsByPharmacy(pharmacyId: string): Promise<CommissionTransaction[]> {
    return await db.select().from(commissionTransactions).where(eq(commissionTransactions.pharmacyId, pharmacyId));
  }

  async getCommissionTransactionsByLaboratory(laboratoryId: string): Promise<CommissionTransaction[]> {
    return await db.select().from(commissionTransactions).where(eq(commissionTransactions.laboratoryId, laboratoryId));
  }

  async listCommissionTransactions(): Promise<CommissionTransaction[]> {
    return await db.select().from(commissionTransactions);
  }

  // Prescriptions
  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const result = await db.insert(prescriptions).values(prescription).returning();
    return result[0];
  }

  async getPrescription(id: string): Promise<Prescription | null> {
    const result = await db.select().from(prescriptions).where(eq(prescriptions.id, id)).limit(1);
    return result[0] || null;
  }

  async getPrescriptionsByCustomer(customerId: string): Promise<Prescription[]> {
    return await db.select().from(prescriptions).where(eq(prescriptions.customerId, customerId));
  }

  async getPrescriptionsByPharmacy(pharmacyId: string): Promise<Prescription[]> {
    return await db.select().from(prescriptions).where(eq(prescriptions.pharmacyId, pharmacyId));
  }

  async updatePrescription(id: string, updates: Partial<Prescription>): Promise<Prescription | null> {
    const result = await db.update(prescriptions).set(updates).where(eq(prescriptions.id, id)).returning();
    return result[0] || null;
  }

  async listPrescriptions(): Promise<Prescription[]> {
    return await db.select().from(prescriptions);
  }

  // Prescription Medications
  async createPrescriptionMedication(medication: InsertPrescriptionMedication): Promise<PrescriptionMedication> {
    const result = await db.insert(prescriptionMedications).values(medication).returning();
    return result[0];
  }

  async getPrescriptionMedication(id: string): Promise<PrescriptionMedication | null> {
    const result = await db.select().from(prescriptionMedications).where(eq(prescriptionMedications.id, id)).limit(1);
    return result[0] || null;
  }

  async getPrescriptionMedicationsByPrescription(prescriptionId: string): Promise<PrescriptionMedication[]> {
    return await db.select().from(prescriptionMedications).where(eq(prescriptionMedications.prescriptionId, prescriptionId));
  }

  async updatePrescriptionMedication(id: string, updates: Partial<PrescriptionMedication>): Promise<PrescriptionMedication | null> {
    const result = await db.update(prescriptionMedications).set(updates).where(eq(prescriptionMedications.id, id)).returning();
    return result[0] || null;
  }

  async deletePrescriptionMedication(id: string): Promise<boolean> {
    const result = await db.delete(prescriptionMedications).where(eq(prescriptionMedications.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
