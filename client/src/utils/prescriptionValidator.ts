// Prescription validation utility for doctor credentials and document requirements
export interface PrescriptionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DoctorCredentials {
  name: string;
  qualification: string;
  registrationNumber: string;
  hasRubberStamp: boolean;
}

const validQualifications = [
  'MBBS',
  'MD',
  'MS',
  'FRCS',
  'MRCS',
  'FCPS',
  'DM',
  'DNB',
  'PhD (Medicine)',
  'MSc (Medicine)',
  'Diploma in Medicine'
];

export function validatePrescription(
  file: File,
  doctorName?: string,
  doctorQualification?: string,
  hasRubberStamp?: boolean,
  registrationNumber?: string
): PrescriptionValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPEG, PNG, WEBP, and PDF files are allowed for prescriptions');
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    errors.push('File size must be less than 10MB');
  }

  // Validate doctor name
  if (!doctorName || doctorName.trim().length < 3) {
    errors.push('Doctor name is required and must be at least 3 characters');
  }

  // Validate doctor qualification
  if (!doctorQualification || doctorQualification.trim().length === 0) {
    errors.push('Doctor qualification is required');
  } else {
    const normalizedQualification = doctorQualification.toUpperCase().trim();
    
    // Check if qualification contains MBBS or other valid medical degrees
    const hasValidQualification = validQualifications.some(qual => 
      normalizedQualification.includes(qual)
    );
    
    if (!hasValidQualification) {
      errors.push(`Invalid medical qualification. Must include one of: ${validQualifications.join(', ')}`);
    }
    
    // Specifically check for MBBS requirement
    if (!normalizedQualification.includes('MBBS') && !normalizedQualification.includes('MD')) {
      warnings.push('Prescription should preferably be from a doctor with MBBS or MD qualification');
    }
  }

  // Validate rubber stamp requirement
  if (!hasRubberStamp) {
    errors.push('Doctor rubber stamp/seal is required on the prescription');
  }

  // Validate registration number
  if (!registrationNumber || registrationNumber.trim().length < 4) {
    errors.push('Doctor registration number with SLMC (Sri Lanka Medical Council) is required');
  }

  // Additional validation warnings
  if (doctorName && doctorName.includes('Dr.') === false && doctorName.includes('Doctor') === false) {
    warnings.push('Doctor name should include proper title (Dr. or Doctor)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateDoctorQualification(qualification: string): boolean {
  if (!qualification) return false;
  
  const normalizedQualification = qualification.toUpperCase().trim();
  return validQualifications.some(qual => 
    normalizedQualification.includes(qual)
  );
}

export function extractDoctorInfo(prescriptionText: string): Partial<DoctorCredentials> {
  const info: Partial<DoctorCredentials> = {};
  
  // Extract doctor name patterns
  const namePatterns = [
    /Dr\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    /Doctor\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
  ];
  
  for (const pattern of namePatterns) {
    const match = prescriptionText.match(pattern);
    if (match) {
      info.name = match[0];
      break;
    }
  }
  
  // Extract qualifications
  const qualificationPattern = /\b(MBBS|MD|MS|FRCS|MRCS|FCPS|DM|DNB)\b/gi;
  const qualMatch = prescriptionText.match(qualificationPattern);
  if (qualMatch) {
    info.qualification = qualMatch.join(', ');
  }
  
  // Extract registration numbers
  const regPattern = /(?:SLMC|Reg\.?\s*No\.?)\s*:?\s*(\d+)/gi;
  const regMatch = prescriptionText.match(regPattern);
  if (regMatch) {
    info.registrationNumber = regMatch[0];
  }
  
  return info;
}