// Simple in-memory storage implementation for DigiFarmacy
// This provides a working storage layer while database connectivity is being resolved

import { 
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

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: User[] = [];
  private profiles: Profile[] = [];
  private pharmacies: PharmacyDetails[] = [];
  private laboratories: LaboratoryDetails[] = [];
  private labBookings: LabBooking[] = [];
  private commissionTransactions: CommissionTransaction[] = [];
  private prescriptions: Prescription[] = [];
  private prescriptionMedications: PrescriptionMedication[] = [];

  constructor() {
    // Initialize with sample data for Sri Lankan healthcare system
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample pharmacies in Sri Lanka
    const samplePharmacies: PharmacyDetails[] = [
      {
        id: 'pharmacy-001',
        userId: 'user-pharmacy-001',
        businessName: 'Osusala Pharmacy - Colombo',
        registrationNumber: 'PH-COL-001',
        address: 'No. 123, Galle Road, Colombo 03',
        latitude: '6.9271',
        longitude: '79.8612',
        contactPhone: '+94 11 234 5678',
        contactEmail: 'info@osusala-colombo.lk',
        operatingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '09:00', close: '18:00' }
        },
        pharmacistCertificateUrl: null,
        businessRegistrationUrl: null,
        verificationNotes: null,
        verifiedAt: new Date(),
        verifiedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'pharmacy-002',
        userId: 'user-pharmacy-002',
        businessName: 'Guardian Pharmacy - Kandy',
        registrationNumber: 'PH-KAN-002',
        address: 'No. 45, Peradeniya Road, Kandy',
        latitude: '7.2906',
        longitude: '80.6337',
        contactPhone: '+94 81 223 4567',
        contactEmail: 'kandy@guardian.lk',
        operatingHours: {
          monday: { open: '08:30', close: '21:00' },
          tuesday: { open: '08:30', close: '21:00' },
          wednesday: { open: '08:30', close: '21:00' },
          thursday: { open: '08:30', close: '21:00' },
          friday: { open: '08:30', close: '21:00' },
          saturday: { open: '08:30', close: '19:00' },
          sunday: { open: '09:00', close: '17:00' }
        },
        pharmacistCertificateUrl: null,
        businessRegistrationUrl: null,
        verificationNotes: null,
        verifiedAt: new Date(),
        verifiedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Sample laboratories in Sri Lanka
    const sampleLaboratories: LaboratoryDetails[] = [
      {
        id: 'lab-001',
        userId: 'user-lab-001',
        businessName: 'Asiri Central Hospital Laboratory',
        registrationNumber: 'LAB-COL-001',
        address: 'No. 114, Norris Canal Road, Colombo 10',
        contactPhone: '+94 11 466 5500',
        contactEmail: 'lab@asiri.lk',
        operatingHours: {
          monday: { open: '06:00', close: '20:00' },
          tuesday: { open: '06:00', close: '20:00' },
          wednesday: { open: '06:00', close: '20:00' },
          thursday: { open: '06:00', close: '20:00' },
          friday: { open: '06:00', close: '20:00' },
          saturday: { open: '06:00', close: '16:00' },
          sunday: { open: '08:00', close: '14:00' }
        },
        servicesOffered: ['Blood Tests', 'Urine Tests', 'X-Ray', 'ECG', 'Home Collection'],
        homeVisitAvailable: true,
        homeVisitCharges: '2500.00',
        verifiedAt: new Date(),
        verifiedBy: null,
        verificationNotes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'lab-002',
        userId: 'user-lab-002',
        businessName: 'Nawaloka Laboratory Services',
        registrationNumber: 'LAB-COL-002',
        address: 'No. 23, Deshamanya H. K. Dharmadasa Mawatha, Colombo 02',
        contactPhone: '+94 11 544 4444',
        contactEmail: 'lab@nawaloka.com',
        operatingHours: {
          monday: { open: '05:30', close: '21:00' },
          tuesday: { open: '05:30', close: '21:00' },
          wednesday: { open: '05:30', close: '21:00' },
          thursday: { open: '05:30', close: '21:00' },
          friday: { open: '05:30', close: '21:00' },
          saturday: { open: '05:30', close: '18:00' },
          sunday: { open: '07:00', close: '16:00' }
        },
        servicesOffered: ['Complete Blood Count', 'Lipid Profile', 'Liver Function Tests', 'Kidney Function Tests', 'Diabetes Tests', 'Home Collection'],
        homeVisitAvailable: true,
        homeVisitCharges: '3000.00',
        verifiedAt: new Date(),
        verifiedBy: null,
        verificationNotes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    this.pharmacies = samplePharmacies;
    this.laboratories = sampleLaboratories;
  }

  // User methods (legacy support)
  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.users.length + 1,
      username: user.username,
      password: user.password,
    };
    this.users.push(newUser);
    return newUser;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return this.users[userIndex];
  }

  async deleteUser(id: number): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;
    
    this.users.splice(userIndex, 1);
    return true;
  }

  async listUsers(): Promise<User[]> {
    return [...this.users];
  }

  // Profile methods
  async createProfile(profile: InsertProfile): Promise<Profile> {
    const newProfile: Profile = {
      id: profile.id || `profile_${Date.now()}`,
      email: profile.email,
      fullName: profile.fullName,
      phone: profile.phone,
      role: profile.role || 'customer',
      status: profile.status || 'pending',
      preferredLanguage: profile.preferredLanguage || 'en',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.push(newProfile);
    return newProfile;
  }

  async getProfile(id: string): Promise<Profile | null> {
    return this.profiles.find(profile => profile.id === id) || null;
  }

  async getProfileByEmail(email: string): Promise<Profile | null> {
    return this.profiles.find(profile => profile.email === email) || null;
  }

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    const profileIndex = this.profiles.findIndex(profile => profile.id === id);
    if (profileIndex === -1) return null;
    
    this.profiles[profileIndex] = { ...this.profiles[profileIndex], ...updates, updatedAt: new Date() };
    return this.profiles[profileIndex];
  }

  async listProfiles(): Promise<Profile[]> {
    return [...this.profiles];
  }

  // Pharmacy methods
  async createPharmacyDetails(pharmacy: InsertPharmacyDetails): Promise<PharmacyDetails> {
    const newPharmacy: PharmacyDetails = {
      id: `pharmacy_${Date.now()}`,
      userId: pharmacy.userId,
      businessName: pharmacy.businessName,
      registrationNumber: pharmacy.registrationNumber,
      address: pharmacy.address,
      latitude: pharmacy.latitude,
      longitude: pharmacy.longitude,
      contactPhone: pharmacy.contactPhone,
      contactEmail: pharmacy.contactEmail,
      operatingHours: pharmacy.operatingHours,
      pharmacistCertificateUrl: pharmacy.pharmacistCertificateUrl,
      businessRegistrationUrl: pharmacy.businessRegistrationUrl,
      verificationNotes: pharmacy.verificationNotes,
      verifiedAt: pharmacy.verifiedAt,
      verifiedBy: pharmacy.verifiedBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.pharmacies.push(newPharmacy);
    return newPharmacy;
  }

  async getPharmacyDetails(id: string): Promise<PharmacyDetails | null> {
    return this.pharmacies.find(pharmacy => pharmacy.id === id) || null;
  }

  async getPharmacyByUserId(userId: string): Promise<PharmacyDetails | null> {
    return this.pharmacies.find(pharmacy => pharmacy.userId === userId) || null;
  }

  async updatePharmacyDetails(id: string, updates: Partial<PharmacyDetails>): Promise<PharmacyDetails | null> {
    const pharmacyIndex = this.pharmacies.findIndex(pharmacy => pharmacy.id === id);
    if (pharmacyIndex === -1) return null;
    
    this.pharmacies[pharmacyIndex] = { ...this.pharmacies[pharmacyIndex], ...updates, updatedAt: new Date() };
    return this.pharmacies[pharmacyIndex];
  }

  async listPharmacies(): Promise<PharmacyDetails[]> {
    return [...this.pharmacies];
  }

  // Laboratory methods
  async createLaboratoryDetails(laboratory: InsertLaboratoryDetails): Promise<LaboratoryDetails> {
    const newLaboratory: LaboratoryDetails = {
      id: `lab_${Date.now()}`,
      userId: laboratory.userId,
      businessName: laboratory.businessName,
      registrationNumber: laboratory.registrationNumber,
      address: laboratory.address,
      contactPhone: laboratory.contactPhone,
      contactEmail: laboratory.contactEmail,
      operatingHours: laboratory.operatingHours,
      servicesOffered: laboratory.servicesOffered,
      homeVisitAvailable: laboratory.homeVisitAvailable || false,
      homeVisitCharges: laboratory.homeVisitCharges,
      verifiedAt: laboratory.verifiedAt,
      verifiedBy: laboratory.verifiedBy,
      verificationNotes: laboratory.verificationNotes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.laboratories.push(newLaboratory);
    return newLaboratory;
  }

  async getLaboratoryDetails(id: string): Promise<LaboratoryDetails | null> {
    return this.laboratories.find(lab => lab.id === id) || null;
  }

  async getLaboratoryByUserId(userId: string): Promise<LaboratoryDetails | null> {
    return this.laboratories.find(lab => lab.userId === userId) || null;
  }

  async updateLaboratoryDetails(id: string, updates: Partial<LaboratoryDetails>): Promise<LaboratoryDetails | null> {
    const labIndex = this.laboratories.findIndex(lab => lab.id === id);
    if (labIndex === -1) return null;
    
    this.laboratories[labIndex] = { ...this.laboratories[labIndex], ...updates, updatedAt: new Date() };
    return this.laboratories[labIndex];
  }

  async listLaboratories(): Promise<LaboratoryDetails[]> {
    return [...this.laboratories];
  }

  // Lab Booking methods
  async createLabBooking(booking: InsertLabBooking): Promise<LabBooking> {
    const newBooking: LabBooking = {
      id: `booking_${Date.now()}`,
      laboratoryId: booking.laboratoryId,
      customerName: booking.customerName,
      contactPhone: booking.contactPhone,
      address: booking.address,
      serviceType: booking.serviceType,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      specialInstructions: booking.specialInstructions,
      status: booking.status || 'pending',
      totalAmount: booking.totalAmount,
      commissionAmount: booking.commissionAmount,
      bookingDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.labBookings.push(newBooking);
    return newBooking;
  }

  async getLabBooking(id: string): Promise<LabBooking | null> {
    return this.labBookings.find(booking => booking.id === id) || null;
  }

  async getLabBookingsByLaboratory(laboratoryId: string): Promise<LabBooking[]> {
    return this.labBookings.filter(booking => booking.laboratoryId === laboratoryId);
  }

  async updateLabBooking(id: string, updates: Partial<LabBooking>): Promise<LabBooking | null> {
    const bookingIndex = this.labBookings.findIndex(booking => booking.id === id);
    if (bookingIndex === -1) return null;
    
    this.labBookings[bookingIndex] = { ...this.labBookings[bookingIndex], ...updates, updatedAt: new Date() };
    return this.labBookings[bookingIndex];
  }

  async deleteLabBooking(id: string): Promise<boolean> {
    const bookingIndex = this.labBookings.findIndex(booking => booking.id === id);
    if (bookingIndex === -1) return false;
    
    this.labBookings.splice(bookingIndex, 1);
    return true;
  }

  async listLabBookings(): Promise<LabBooking[]> {
    return [...this.labBookings];
  }

  // Commission Transaction methods
  async createCommissionTransaction(transaction: InsertCommissionTransaction): Promise<CommissionTransaction> {
    const newTransaction: CommissionTransaction = {
      id: `commission_${Date.now()}`,
      type: transaction.type,
      amount: transaction.amount,
      platformCommission: transaction.platformCommission,
      providerEarnings: transaction.providerEarnings,
      pharmacyId: transaction.pharmacyId,
      laboratoryId: transaction.laboratoryId,
      prescriptionId: transaction.prescriptionId,
      labBookingId: transaction.labBookingId,
      status: transaction.status || 'pending',
      description: transaction.description,
      transactionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.commissionTransactions.push(newTransaction);
    return newTransaction;
  }

  async getCommissionTransaction(id: string): Promise<CommissionTransaction | null> {
    return this.commissionTransactions.find(transaction => transaction.id === id) || null;
  }

  async getCommissionTransactionsByPharmacy(pharmacyId: string): Promise<CommissionTransaction[]> {
    return this.commissionTransactions.filter(transaction => transaction.pharmacyId === pharmacyId);
  }

  async getCommissionTransactionsByLaboratory(laboratoryId: string): Promise<CommissionTransaction[]> {
    return this.commissionTransactions.filter(transaction => transaction.laboratoryId === laboratoryId);
  }

  async listCommissionTransactions(): Promise<CommissionTransaction[]> {
    return [...this.commissionTransactions];
  }

  // Prescription methods
  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const newPrescription: Prescription = {
      id: `prescription_${Date.now()}`,
      pharmacyId: prescription.pharmacyId,
      customerName: prescription.customerName,
      contactPhone: prescription.contactPhone,
      prescriptionImageUrl: prescription.prescriptionImageUrl,
      aiAnalysisResult: prescription.aiAnalysisResult,
      status: prescription.status || 'pending',
      totalAmount: prescription.totalAmount,
      commissionAmount: prescription.commissionAmount,
      notes: prescription.notes,
      uploadDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.prescriptions.push(newPrescription);
    return newPrescription;
  }

  async getPrescription(id: string): Promise<Prescription | null> {
    return this.prescriptions.find(prescription => prescription.id === id) || null;
  }

  async getPrescriptionsByPharmacy(pharmacyId: string): Promise<Prescription[]> {
    return this.prescriptions.filter(prescription => prescription.pharmacyId === pharmacyId);
  }

  async updatePrescription(id: string, updates: Partial<Prescription>): Promise<Prescription | null> {
    const prescriptionIndex = this.prescriptions.findIndex(prescription => prescription.id === id);
    if (prescriptionIndex === -1) return null;
    
    this.prescriptions[prescriptionIndex] = { ...this.prescriptions[prescriptionIndex], ...updates, updatedAt: new Date() };
    return this.prescriptions[prescriptionIndex];
  }

  async listPrescriptions(): Promise<Prescription[]> {
    return [...this.prescriptions];
  }

  // Prescription Medication methods
  async createPrescriptionMedication(medication: InsertPrescriptionMedication): Promise<PrescriptionMedication> {
    const newMedication: PrescriptionMedication = {
      id: `medication_${Date.now()}`,
      prescriptionId: medication.prescriptionId,
      medicationName: medication.medicationName,
      dosage: medication.dosage,
      frequency: medication.frequency,
      duration: medication.duration,
      quantity: medication.quantity,
      unitPrice: medication.unitPrice,
      totalPrice: medication.totalPrice,
      availability: medication.availability || 'available',
      alternativeSuggestion: medication.alternativeSuggestion,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.prescriptionMedications.push(newMedication);
    return newMedication;
  }

  async getPrescriptionMedication(id: string): Promise<PrescriptionMedication | null> {
    return this.prescriptionMedications.find(medication => medication.id === id) || null;
  }

  async getPrescriptionMedicationsByPrescription(prescriptionId: string): Promise<PrescriptionMedication[]> {
    return this.prescriptionMedications.filter(medication => medication.prescriptionId === prescriptionId);
  }

  async updatePrescriptionMedication(id: string, updates: Partial<PrescriptionMedication>): Promise<PrescriptionMedication | null> {
    const medicationIndex = this.prescriptionMedications.findIndex(medication => medication.id === id);
    if (medicationIndex === -1) return null;
    
    this.prescriptionMedications[medicationIndex] = { ...this.prescriptionMedications[medicationIndex], ...updates, updatedAt: new Date() };
    return this.prescriptionMedications[medicationIndex];
  }

  async deletePrescriptionMedication(id: string): Promise<boolean> {
    const medicationIndex = this.prescriptionMedications.findIndex(medication => medication.id === id);
    if (medicationIndex === -1) return false;
    
    this.prescriptionMedications.splice(medicationIndex, 1);
    return true;
  }
}

export const storage = new MemStorage();