class Patient {
  final String id;
  final String abhaId;
  final String name;
  final String phoneNumber;
  final String email;
  final DateTime birthDate;
  final String gender;
  final String address;
  final String? aadharNumber;
  final String? medicalRecordNumber;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isActive;
  final String? profileImageUrl;
  final List<String> languagePreferences;
  final PatientVitals? latestVitals;
  final List<MedicalCondition> conditions;
  final EmergencyContact? emergencyContact;

  Patient({
    required this.id,
    required this.abhaId,
    required this.name,
    required this.phoneNumber,
    required this.email,
    required this.birthDate,
    required this.gender,
    required this.address,
    this.aadharNumber,
    this.medicalRecordNumber,
    required this.createdAt,
    required this.updatedAt,
    this.isActive = true,
    this.profileImageUrl,
    this.languagePreferences = const ['en'],
    this.latestVitals,
    this.conditions = const [],
    this.emergencyContact,
  });

  int get age {
    final now = DateTime.now();
    int age = now.year - birthDate.year;
    if (now.month < birthDate.month ||
        (now.month == birthDate.month && now.day < birthDate.day)) {
      age--;
    }
    return age;
  }

  factory Patient.fromJson(Map<String, dynamic> json) {
    return Patient(
      id: json['id'],
      abhaId: json['abha_id'],
      name: json['name'],
      phoneNumber: json['phone_number'],
      email: json['email'],
      birthDate: DateTime.parse(json['birth_date']),
      gender: json['gender'],
      address: json['address'],
      aadharNumber: json['aadhar_number'],
      medicalRecordNumber: json['medical_record_number'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      isActive: json['is_active'] ?? true,
      profileImageUrl: json['profile_image_url'],
      languagePreferences: List<String>.from(json['language_preferences'] ?? ['en']),
      latestVitals: json['latest_vitals'] != null 
          ? PatientVitals.fromJson(json['latest_vitals']) 
          : null,
      conditions: (json['conditions'] as List<dynamic>?)
          ?.map((e) => MedicalCondition.fromJson(e))
          .toList() ?? [],
      emergencyContact: json['emergency_contact'] != null
          ? EmergencyContact.fromJson(json['emergency_contact'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'abha_id': abhaId,
      'name': name,
      'phone_number': phoneNumber,
      'email': email,
      'birth_date': birthDate.toIso8601String(),
      'gender': gender,
      'address': address,
      'aadhar_number': aadharNumber,
      'medical_record_number': medicalRecordNumber,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'is_active': isActive,
      'profile_image_url': profileImageUrl,
      'language_preferences': languagePreferences,
      'latest_vitals': latestVitals?.toJson(),
      'conditions': conditions.map((e) => e.toJson()).toList(),
      'emergency_contact': emergencyContact?.toJson(),
    };
  }

  Patient copyWith({
    String? id,
    String? abhaId,
    String? name,
    String? phoneNumber,
    String? email,
    DateTime? birthDate,
    String? gender,
    String? address,
    String? aadharNumber,
    String? medicalRecordNumber,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isActive,
    String? profileImageUrl,
    List<String>? languagePreferences,
    PatientVitals? latestVitals,
    List<MedicalCondition>? conditions,
    EmergencyContact? emergencyContact,
  }) {
    return Patient(
      id: id ?? this.id,
      abhaId: abhaId ?? this.abhaId,
      name: name ?? this.name,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      email: email ?? this.email,
      birthDate: birthDate ?? this.birthDate,
      gender: gender ?? this.gender,
      address: address ?? this.address,
      aadharNumber: aadharNumber ?? this.aadharNumber,
      medicalRecordNumber: medicalRecordNumber ?? this.medicalRecordNumber,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isActive: isActive ?? this.isActive,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      languagePreferences: languagePreferences ?? this.languagePreferences,
      latestVitals: latestVitals ?? this.latestVitals,
      conditions: conditions ?? this.conditions,
      emergencyContact: emergencyContact ?? this.emergencyContact,
    );
  }
}

class PatientVitals {
  final String id;
  final String patientId;
  final double? height;
  final double? weight;
  final int? systolicBP;
  final int? diastolicBP;
  final int? heartRate;
  final double? temperature;
  final double? oxygenSaturation;
  final double? sugarLevel;
  final bool? isFastingSugar;
  final DateTime recordedAt;
  final String recordedBy;

  PatientVitals({
    required this.id,
    required this.patientId,
    this.height,
    this.weight,
    this.systolicBP,
    this.diastolicBP,
    this.heartRate,
    this.temperature,
    this.oxygenSaturation,
    this.sugarLevel,
    this.isFastingSugar,
    required this.recordedAt,
    required this.recordedBy,
  });

  double? get bmi {
    if (height != null && weight != null && height! > 0) {
      final heightInMeters = height! / 100;
      return weight! / (heightInMeters * heightInMeters);
    }
    return null;
  }

  String get bloodPressure {
    if (systolicBP != null && diastolicBP != null) {
      return '$systolicBP/$diastolicBP';
    }
    return 'N/A';
  }

  factory PatientVitals.fromJson(Map<String, dynamic> json) {
    return PatientVitals(
      id: json['id'],
      patientId: json['patient_id'],
      height: json['height']?.toDouble(),
      weight: json['weight']?.toDouble(),
      systolicBP: json['systolic_bp'],
      diastolicBP: json['diastolic_bp'],
      heartRate: json['heart_rate'],
      temperature: json['temperature']?.toDouble(),
      oxygenSaturation: json['oxygen_saturation']?.toDouble(),
      sugarLevel: json['sugar_level']?.toDouble(),
      isFastingSugar: json['is_fasting_sugar'],
      recordedAt: DateTime.parse(json['recorded_at']),
      recordedBy: json['recorded_by'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'patient_id': patientId,
      'height': height,
      'weight': weight,
      'systolic_bp': systolicBP,
      'diastolic_bp': diastolicBP,
      'heart_rate': heartRate,
      'temperature': temperature,
      'oxygen_saturation': oxygenSaturation,
      'sugar_level': sugarLevel,
      'is_fasting_sugar': isFastingSugar,
      'recorded_at': recordedAt.toIso8601String(),
      'recorded_by': recordedBy,
    };
  }
}

class MedicalCondition {
  final String id;
  final String patientId;
  final String condition;
  final String severity;
  final DateTime diagnosedAt;
  final String diagnosedBy;
  final bool isActive;
  final String? notes;
  final List<String> symptoms;
  final String? treatmentPlan;

  MedicalCondition({
    required this.id,
    required this.patientId,
    required this.condition,
    required this.severity,
    required this.diagnosedAt,
    required this.diagnosedBy,
    this.isActive = true,
    this.notes,
    this.symptoms = const [],
    this.treatmentPlan,
  });

  factory MedicalCondition.fromJson(Map<String, dynamic> json) {
    return MedicalCondition(
      id: json['id'],
      patientId: json['patient_id'],
      condition: json['condition'],
      severity: json['severity'],
      diagnosedAt: DateTime.parse(json['diagnosed_at']),
      diagnosedBy: json['diagnosed_by'],
      isActive: json['is_active'] ?? true,
      notes: json['notes'],
      symptoms: List<String>.from(json['symptoms'] ?? []),
      treatmentPlan: json['treatment_plan'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'patient_id': patientId,
      'condition': condition,
      'severity': severity,
      'diagnosed_at': diagnosedAt.toIso8601String(),
      'diagnosed_by': diagnosedBy,
      'is_active': isActive,
      'notes': notes,
      'symptoms': symptoms,
      'treatment_plan': treatmentPlan,
    };
  }
}

class EmergencyContact {
  final String name;
  final String phoneNumber;
  final String relationship;
  final String? address;

  EmergencyContact({
    required this.name,
    required this.phoneNumber,
    required this.relationship,
    this.address,
  });

  factory EmergencyContact.fromJson(Map<String, dynamic> json) {
    return EmergencyContact(
      name: json['name'],
      phoneNumber: json['phone_number'],
      relationship: json['relationship'],
      address: json['address'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'phone_number': phoneNumber,
      'relationship': relationship,
      'address': address,
    };
  }
}