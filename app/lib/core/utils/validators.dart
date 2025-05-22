import 'dart:io';

class Validators {
  // Email validation
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }
    
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    
    if (!emailRegex.hasMatch(value)) {
      return 'Please enter a valid email address';
    }
    
    return null;
  }

  // Phone number validation (Indian format)
  static String? validatePhoneNumber(String? value) {
    if (value == null || value.isEmpty) {
      return 'Phone number is required';
    }
    
    // Remove all non-digit characters
    final cleanedNumber = value.replaceAll(RegExp(r'[^\d]'), '');
    
    // Check for Indian phone number format
    if (cleanedNumber.length == 10) {
      // 10-digit number without country code
      if (!RegExp(r'^[6-9]\d{9}$').hasMatch(cleanedNumber)) {
        return 'Please enter a valid 10-digit phone number';
      }
    } else if (cleanedNumber.length == 12) {
      // 12-digit number with country code (+91)
      if (!RegExp(r'^91[6-9]\d{9}$').hasMatch(cleanedNumber)) {
        return 'Please enter a valid phone number with country code';
      }
    } else {
      return 'Please enter a valid phone number';
    }
    
    return null;
  }

  // Password validation
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }
    
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    if (!RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)').hasMatch(value)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    return null;
  }

  // Confirm password validation
  static String? validateConfirmPassword(String? value, String password) {
    if (value == null || value.isEmpty) {
      return 'Please confirm your password';
    }
    
    if (value != password) {
      return 'Passwords do not match';
    }
    
    return null;
  }

  // Name validation
  static String? validateName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Name is required';
    }
    
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    
    if (!RegExp(r'^[a-zA-Z\s]+$').hasMatch(value)) {
      return 'Name can only contain letters and spaces';
    }
    
    return null;
  }

  // Age validation
  static String? validateAge(String? value) {
    if (value == null || value.isEmpty) {
      return 'Age is required';
    }
    
    final age = int.tryParse(value);
    if (age == null) {
      return 'Please enter a valid age';
    }
    
    if (age < 0 || age > 150) {
      return 'Please enter a valid age between 0 and 150';
    }
    
    return null;
  }

  // Date validation
  static String? validateDate(String? value) {
    if (value == null || value.isEmpty) {
      return 'Date is required';
    }
    
    try {
      final date = DateTime.parse(value);
      final now = DateTime.now();
      
      if (date.isAfter(now)) {
        return 'Date cannot be in the future';
      }
      
      return null;
    } catch (e) {
      return 'Please enter a valid date';
    }
  }

  // Birth date validation
  static String? validateBirthDate(String? value) {
    if (value == null || value.isEmpty) {
      return 'Birth date is required';
    }
    
    try {
      final birthDate = DateTime.parse(value);
      final now = DateTime.now();
      final age = now.difference(birthDate).inDays ~/ 365;
      
      if (birthDate.isAfter(now)) {
        return 'Birth date cannot be in the future';
      }
      
      if (age > 150) {
        return 'Please enter a valid birth date';
      }
      
      return null;
    } catch (e) {
      return 'Please enter a valid birth date';
    }
  }

  // ABHA ID validation
  static String? validateAbhaId(String? value) {
    if (value == null || value.isEmpty) {
      return 'ABHA ID is required';
    }
    
    // ABHA ID is 14 digits
    final cleanedId = value.replaceAll(RegExp(r'[^\d]'), '');
    
    if (cleanedId.length != 14) {
      return 'ABHA ID must be 14 digits';
    }
    
    if (!RegExp(r'^\d{14}$').hasMatch(cleanedId)) {
      return 'ABHA ID can only contain numbers';
    }
    
    return null;
  }

  // Aadhar number validation
  static String? validateAadhar(String? value) {
    if (value == null || value.isEmpty) {
      return 'Aadhar number is required';
    }
    
    final cleanedNumber = value.replaceAll(RegExp(r'[^\d]'), '');
    
    if (cleanedNumber.length != 12) {
      return 'Aadhar number must be 12 digits';
    }
    
    if (!RegExp(r'^\d{12}$').hasMatch(cleanedNumber)) {
      return 'Aadhar number can only contain numbers';
    }
    
    return null;
  }

  // Medical record number validation
  static String? validateMedicalRecordNumber(String? value) {
    if (value == null || value.isEmpty) {
      return 'Medical record number is required';
    }
    
    if (value.trim().length < 3) {
      return 'Medical record number must be at least 3 characters';
    }
    
    if (!RegExp(r'^[A-Za-z0-9]+$').hasMatch(value)) {
      return 'Medical record number can only contain letters and numbers';
    }
    
    return null;
  }

  // Blood pressure validation
  static String? validateBloodPressure(String? systolic, String? diastolic) {
    if (systolic == null || systolic.isEmpty) {
      return 'Systolic pressure is required';
    }
    
    if (diastolic == null || diastolic.isEmpty) {
      return 'Diastolic pressure is required';
    }
    
    final sys = int.tryParse(systolic);
    final dia = int.tryParse(diastolic);
    
    if (sys == null || dia == null) {
      return 'Please enter valid blood pressure values';
    }
    
    if (sys < 50 || sys > 300) {
      return 'Systolic pressure should be between 50-300 mmHg';
    }
    
    if (dia < 30 || dia > 200) {
      return 'Diastolic pressure should be between 30-200 mmHg';
    }
    
    if (sys <= dia) {
      return 'Systolic pressure should be greater than diastolic pressure';
    }
    
    return null;
  }

  // Heart rate validation
  static String? validateHeartRate(String? value) {
    if (value == null || value.isEmpty) {
      return 'Heart rate is required';
    }
    
    final heartRate = int.tryParse(value);
    if (heartRate == null) {
      return 'Please enter a valid heart rate';
    }
    
    if (heartRate < 30 || heartRate > 220) {
      return 'Heart rate should be between 30-220 bpm';
    }
    
    return null;
  }

  // Weight validation
  static String? validateWeight(String? value) {
    if (value == null || value.isEmpty) {
      return 'Weight is required';
    }
    
    final weight = double.tryParse(value);
    if (weight == null) {
      return 'Please enter a valid weight';
    }
    
    if (weight < 1 || weight > 300) {
      return 'Weight should be between 1-300 kg';
    }
    
    return null;
  }

  // Height validation
  static String? validateHeight(String? value) {
    if (value == null || value.isEmpty) {
      return 'Height is required';
    }
    
    final height = double.tryParse(value);
    if (height == null) {
      return 'Please enter a valid height';
    }
    
    if (height < 30 || height > 250) {
      return 'Height should be between 30-250 cm';
    }
    
    return null;
  }

  // Temperature validation
  static String? validateTemperature(String? value) {
    if (value == null || value.isEmpty) {
      return 'Temperature is required';
    }
    
    final temperature = double.tryParse(value);
    if (temperature == null) {
      return 'Please enter a valid temperature';
    }
    
    if (temperature < 30 || temperature > 50) {
      return 'Temperature should be between 30-50°C';
    }
    
    return null;
  }

  // Sugar level validation
  static String? validateSugarLevel(String? value, {bool isFasting = false}) {
    if (value == null || value.isEmpty) {
      return 'Sugar level is required';
    }
    
    final sugarLevel = double.tryParse(value);
    if (sugarLevel == null) {
      return 'Please enter a valid sugar level';
    }
    
    if (sugarLevel < 30 || sugarLevel > 600) {
      return 'Sugar level should be between 30-600 mg/dL';
    }
    
    return null;
  }

  // Cholesterol validation
  static String? validateCholesterol(String? value) {
    if (value == null || value.isEmpty) {
      return 'Cholesterol level is required';
    }
    
    final cholesterol = double.tryParse(value);
    if (cholesterol == null) {
      return 'Please enter a valid cholesterol level';
    }
    
    if (cholesterol < 50 || cholesterol > 500) {
      return 'Cholesterol level should be between 50-500 mg/dL';
    }
    
    return null;
  }

  // Hemoglobin validation
  static String? validateHemoglobin(String? value) {
    if (value == null || value.isEmpty) {
      return 'Hemoglobin level is required';
    }
    
    final hemoglobin = double.tryParse(value);
    if (hemoglobin == null) {
      return 'Please enter a valid hemoglobin level';
    }
    
    if (hemoglobin < 3 || hemoglobin > 25) {
      return 'Hemoglobin level should be between 3-25 g/dL';
    }
    
    return null;
  }

  // Oxygen saturation validation
  static String? validateOxygenSaturation(String? value) {
    if (value == null || value.isEmpty) {
      return 'Oxygen saturation is required';
    }
    
    final oxygenSat = double.tryParse(value);
    if (oxygenSat == null) {
      return 'Please enter a valid oxygen saturation';
    }
    
    if (oxygenSat < 70 || oxygenSat > 100) {
      return 'Oxygen saturation should be between 70-100%';
    }
    
    return null;
  }

  // Medical test result validation
  static String? validateTestResult(String? value) {
    if (value == null || value.isEmpty) {
      return 'Test result is required';
    }
    
    if (value.trim().length < 3) {
      return 'Test result must be at least 3 characters';
    }
    
    return null;
  }

  // Prescription validation
  static String? validatePrescription(String? value) {
    if (value == null || value.isEmpty) {
      return 'Prescription is required';
    }
    
    if (value.trim().length < 10) {
      return 'Prescription must be at least 10 characters';
    }
    
    return null;
  }

  // Dosage validation
  static String? validateDosage(String? value) {
    if (value == null || value.isEmpty) {
      return 'Dosage is required';
    }
    
    if (value.trim().length < 2) {
      return 'Dosage must be at least 2 characters';
    }
    
    return null;
  }

  // Diagnosis validation
  static String? validateDiagnosis(String? value) {
    if (value == null || value.isEmpty) {
      return 'Diagnosis is required';
    }
    
    if (value.trim().length < 5) {
      return 'Diagnosis must be at least 5 characters';
    }
    
    return null;
  }

  // Doctor registration number validation
  static String? validateDoctorRegNumber(String? value) {
    if (value == null || value.isEmpty) {
      return 'Doctor registration number is required';
    }
    
    if (value.trim().length < 5) {
      return 'Registration number must be at least 5 characters';
    }
    
    if (!RegExp(r'^[A-Za-z0-9\/\-]+$').hasMatch(value)) {
      return 'Registration number can only contain letters, numbers, / and -';
    }
    
    return null;
  }

  // Hospital code validation
  static String? validateHospitalCode(String? value) {
    if (value == null || value.isEmpty) {
      return 'Hospital code is required';
    }
    
    if (value.trim().length < 3) {
      return 'Hospital code must be at least 3 characters';
    }
    
    if (!RegExp(r'^[A-Z0-9]+$').hasMatch(value)) {
      return 'Hospital code can only contain uppercase letters and numbers';
    }
    
    return null;
  }

  // Lab test value validation with range
  static String? validateLabValue(String? value, double min, double max, String unit) {
    if (value == null || value.isEmpty) {
      return 'Lab value is required';
    }
    
    final labValue = double.tryParse(value);
    if (labValue == null) {
      return 'Please enter a valid numeric value';
    }
    
    if (labValue < min || labValue > max) {
      return 'Value should be between $min-$max $unit';
    }
    
    return null;
  }

  // Generic numeric range validation
  static String? validateNumericRange(String? value, double min, double max, String fieldName) {
    if (value == null || value.isEmpty) {
      return '$fieldName is required';
    }
    
    final numValue = double.tryParse(value);
    if (numValue == null) {
      return 'Please enter a valid $fieldName';
    }
    
    if (numValue < min || numValue > max) {
      return '$fieldName should be between $min-$max';
    }
    
    return null;
  }

  // File size validation
  static String? validateFileSize(File file, int maxSizeInMB) {
    final fileSizeInBytes = file.lengthSync();
    final fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    
    if (fileSizeInMB > maxSizeInMB) {
      return 'File size should not exceed ${maxSizeInMB}MB';
    }
    
    return null;
  }

  // File type validation
  static String? validateFileType(String fileName, List<String> allowedExtensions) {
    final extension = fileName.split('.').last.toLowerCase();
    
    if (!allowedExtensions.contains(extension)) {
      return 'Only ${allowedExtensions.join(', ')} files are allowed';
    }
    
    return null;
  }

  // Required field validation
  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required';
    }
    
    return null;
  }

  // Minimum length validation
  static String? validateMinLength(String? value, int minLength, String fieldName) {
    if (value == null || value.trim().length < minLength) {
      return '$fieldName must be at least $minLength characters';
    }
    
    return null;
  }

  // Maximum length validation
  static String? validateMaxLength(String? value, int maxLength, String fieldName) {
    if (value != null && value.length > maxLength) {
      return '$fieldName cannot exceed $maxLength characters';
    }
    
    return null;
  }
}