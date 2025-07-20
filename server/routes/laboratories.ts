import { Router, Request, Response } from 'express';

const router = Router();

// Sample Sri Lankan laboratories data with authentic information
const laboratories = [
  {
    id: 'lab-001',
    userId: 'user-lab-001',
    business_name: 'Asiri Laboratory Services',
    address: 'No. 181, Kirula Road, Colombo 05, Sri Lanka',
    location: { lat: 6.8863, lng: 79.8607 },
    contact_phone: '+94 11 466 5500',
    services_offered: ['Blood Tests', 'Urine Analysis', 'ECG', 'X-Ray', 'Ultrasound Scan'],
    home_visit_available: true,
    home_visit_charges: 2500,
    operating_hours: {
      monday: '7:00 AM - 8:00 PM',
      tuesday: '7:00 AM - 8:00 PM',
      wednesday: '7:00 AM - 8:00 PM',
      thursday: '7:00 AM - 8:00 PM',
      friday: '7:00 AM - 8:00 PM',
      saturday: '7:00 AM - 6:00 PM',
      sunday: '8:00 AM - 4:00 PM'
    },
    verified: true,
    rating: 4.8,
    total_bookings: 1250
  },
  {
    id: 'lab-002',
    userId: 'user-lab-002', 
    business_name: 'Nawaloka Laboratory',
    address: 'No. 23, Deshamanya H.K. Dharmadasa Mawatha, Colombo 02, Sri Lanka',
    location: { lat: 6.9147, lng: 79.8610 },
    contact_phone: '+94 11 544 4444',
    services_offered: ['Complete Blood Count', 'Lipid Profile', 'Liver Function', 'Kidney Function', 'Thyroid Tests'],
    home_visit_available: true,
    home_visit_charges: 3000,
    operating_hours: {
      monday: '6:30 AM - 9:00 PM',
      tuesday: '6:30 AM - 9:00 PM', 
      wednesday: '6:30 AM - 9:00 PM',
      thursday: '6:30 AM - 9:00 PM',
      friday: '6:30 AM - 9:00 PM',
      saturday: '6:30 AM - 8:00 PM',
      sunday: '7:00 AM - 6:00 PM'
    },
    verified: true,
    rating: 4.7,
    total_bookings: 980
  },
  {
    id: 'lab-003',
    userId: 'user-lab-003',
    business_name: 'Durdans Laboratory',
    address: 'No. 3, Alfred Place, Colombo 03, Sri Lanka',
    location: { lat: 6.9077, lng: 79.8522 },
    contact_phone: '+94 11 214 0000',
    services_offered: ['Cardiac Markers', 'Diabetes Panel', 'Allergy Tests', 'Hormone Tests', 'Microbiology'],
    home_visit_available: true,
    home_visit_charges: 3500,
    operating_hours: {
      monday: '7:00 AM - 8:00 PM',
      tuesday: '7:00 AM - 8:00 PM',
      wednesday: '7:00 AM - 8:00 PM', 
      thursday: '7:00 AM - 8:00 PM',
      friday: '7:00 AM - 8:00 PM',
      saturday: '7:00 AM - 6:00 PM',
      sunday: '8:00 AM - 4:00 PM'
    },
    verified: true,
    rating: 4.9,
    total_bookings: 1450
  },
  {
    id: 'lab-004',
    userId: 'user-lab-004',
    business_name: 'Lanka Hospital Laboratory',
    address: 'No. 578, Elvitigala Mawatha, Colombo 05, Sri Lanka',
    location: { lat: 6.8918, lng: 79.8737 },
    contact_phone: '+94 11 553 0000',
    services_offered: ['Pathology', 'Radiology', 'Cardiology Tests', 'Neurological Tests', 'Oncology Markers'],
    home_visit_available: true,
    home_visit_charges: 4000,
    operating_hours: {
      monday: '24 Hours',
      tuesday: '24 Hours',
      wednesday: '24 Hours',
      thursday: '24 Hours', 
      friday: '24 Hours',
      saturday: '24 Hours',
      sunday: '24 Hours'
    },
    verified: true,
    rating: 4.8,
    total_bookings: 2100
  },
  {
    id: 'lab-005',
    userId: 'user-lab-005',
    business_name: 'Hemas Laboratory',
    address: 'No. 389, Negombo Road, Wattala, Sri Lanka',
    location: { lat: 6.9897, lng: 79.8907 },
    contact_phone: '+94 11 229 3500',
    services_offered: ['Routine Tests', 'Special Chemistry', 'Immunology', 'Molecular Biology', 'Cytology'],
    home_visit_available: true,
    home_visit_charges: 2800,
    operating_hours: {
      monday: '7:00 AM - 7:00 PM',
      tuesday: '7:00 AM - 7:00 PM',
      wednesday: '7:00 AM - 7:00 PM',
      thursday: '7:00 AM - 7:00 PM',
      friday: '7:00 AM - 7:00 PM',
      saturday: '7:00 AM - 5:00 PM',
      sunday: 'Closed'
    },
    verified: true,
    rating: 4.6,
    total_bookings: 750
  },
  {
    id: 'lab-006',
    userId: 'user-lab-006',
    business_name: 'Central Hospital Laboratory',
    address: 'No. 114, Norris Canal Road, Colombo 10, Sri Lanka',
    location: { lat: 6.9271, lng: 79.8612 },
    contact_phone: '+94 11 269 1111',
    services_offered: ['Emergency Tests', 'ICU Monitoring', 'Blood Bank', 'Microbiology', 'Biochemistry'],
    home_visit_available: false,
    home_visit_charges: 0,
    operating_hours: {
      monday: '24 Hours',
      tuesday: '24 Hours', 
      wednesday: '24 Hours',
      thursday: '24 Hours',
      friday: '24 Hours',
      saturday: '24 Hours',
      sunday: '24 Hours'
    },
    verified: true,
    rating: 4.5,
    total_bookings: 1850
  }
];

// GET /api/laboratories - Get all laboratories
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(laboratories);
  } catch (error) {
    console.error('Error fetching laboratories:', error);
    res.status(500).json({ error: 'Failed to fetch laboratories' });
  }
});

// GET /api/laboratories/:id - Get laboratory by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laboratory = laboratories.find(lab => lab.id === id);
    
    if (!laboratory) {
      return res.status(404).json({ error: 'Laboratory not found' });
    }
    
    res.json(laboratory);
  } catch (error) {
    console.error('Error fetching laboratory:', error);
    res.status(500).json({ error: 'Failed to fetch laboratory' });
  }
});

export default router;