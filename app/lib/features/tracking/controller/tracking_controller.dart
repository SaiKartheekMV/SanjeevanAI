enum ReportStatus {
  pending,
  completed,
  failed,
}

enum DiseaseType {
  tuberculosis,
  pneumonia,
  fattyLiver,
  hepatitis,
  other,
}

enum ReportType {
  xray,
  bloodTest,
  ctScan,
  mri,
  ultrasound,
  other,
}

class Report {
  final String id;
  final String type;
  final String diseaseType;
  final DateTime date;
  final ReportStatus status;
  final String notes;
  final List<String> imagePaths;
  final DateTime? uploadedAt;
  final String? doctorNotes;
  final Map<String, dynamic>? metadata;

  Report({
    required this.id,
    required this.type,
    required this.diseaseType,
    required this.date,
    required this.status,
    this.notes = '',
    required this.imagePaths,
    this.uploadedAt,
    this.doctorNotes,
    this.metadata,
  });

  Report copyWith({
    String? id,
    String? type,
    String? diseaseType,
    DateTime? date,
    ReportStatus? status,
    String? notes,
    List<String>? imagePaths,
    DateTime? uploadedAt,
    String? doctorNotes,
    Map<String, dynamic>? metadata,
  }) {
    return Report(
      id: id ?? this.id,
      type: type ?? this.type,
      diseaseType: diseaseType ?? this.diseaseType,
      date: date ?? this.date,
      status: status ?? this.status,
      notes: notes ?? this.notes,
      imagePaths: imagePaths ?? this.imagePaths,
      uploadedAt: uploadedAt ?? this.uploadedAt,
      doctorNotes: doctorNotes ?? this.doctorNotes,
      metadata: metadata ?? this.metadata,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'diseaseType': diseaseType,
      'date': date.toIso8601String(),
      'status': status.toString(),
      'notes': notes,
      'imagePaths': imagePaths,
      'uploadedAt': uploadedAt?.toIso8601String(),
      'doctorNotes': doctorNotes,
      'metadata': metadata,
    };
  }

  factory Report.fromJson(Map<String, dynamic> json) {
    return Report(
      id: json['id'],
      type: json['type'],
      diseaseType: json['diseaseType'],
      date: DateTime.parse(json['date']),
      status: ReportStatus.values.firstWhere(
        (e) => e.toString() == json['status'],
        orElse: () => ReportStatus.pending,
      ),
      notes: json['notes'] ?? '',
      imagePaths: List<String>.from(json['imagePaths'] ?? []),
      uploadedAt: json['uploadedAt'] != null 
          ? DateTime.parse(json['uploadedAt']) 
          : null,
      doctorNotes: json['doctorNotes'],
      metadata: json['metadata'],
    );
  }
}

class DiseaseProgress {
  final String diseaseType;
  final List<Report> reports;
  final DateTime firstReportDate;
  final DateTime lastReportDate;
  final ReportStatus overallStatus;
  final double progressPercentage;

  DiseaseProgress({
    required this.diseaseType,
    required this.reports,
    required this.firstReportDate,
    required this.lastReportDate,
    required this.overallStatus,
    required this.progressPercentage,
  });

  factory DiseaseProgress.fromReports(String diseaseType, List<Report> reports) {
    if (reports.isEmpty) {
      return DiseaseProgress(
        diseaseType: diseaseType,
        reports: [],
        firstReportDate: DateTime.now(),
        lastReportDate: DateTime.now(),
        overallStatus: ReportStatus.pending,
        progressPercentage: 0.0,
      );
    }

    reports.sort((a, b) => a.date.compareTo(b.date));
    
    final completedReports = reports.where((r) => r.status == ReportStatus.completed).length;
    final progressPercentage = (completedReports / reports.length) * 100;
    
    final overallStatus = reports.every((r) => r.status == ReportStatus.completed)
        ? ReportStatus.completed
        : reports.any((r) => r.status == ReportStatus.failed)
            ? ReportStatus.failed
            : ReportStatus.pending;

    return DiseaseProgress(
      diseaseType: diseaseType,
      reports: reports,
      firstReportDate: reports.first.date,
      lastReportDate: reports.last.date,
      overallStatus: overallStatus,
      progressPercentage: progressPercentage,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'diseaseType': diseaseType,
      'reports': reports.map((r) => r.toJson()).toList(),
      'firstReportDate': firstReportDate.toIso8601String(),
      'lastReportDate': lastReportDate.toIso8601String(),
      'overallStatus': overallStatus.toString(),
      'progressPercentage': progressPercentage,
    };
  }
}

class User {
  final String id;
  final String name;
  final String email;
  final DateTime dateOfBirth;
  final String? phoneNumber;
  final String? address;
  final List<String> medicalHistory;
  final DateTime createdAt;
  final DateTime updatedAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.dateOfBirth,
    this.phoneNumber,
    this.address,
    this.medicalHistory = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  int get age {
    final now = DateTime.now();
    int age = now.year - dateOfBirth.year;
    if (now.month < dateOfBirth.month || 
        (now.month == dateOfBirth.month && now.day < dateOfBirth.day)) {
      age--;
    }
    return age;
  }

  User copyWith({
    String? id,
    String? name,
    String? email,
    DateTime? dateOfBirth,
    String? phoneNumber,
    String? address,
    List<String>? medicalHistory,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      address: address ?? this.address,
      medicalHistory: medicalHistory ?? this.medicalHistory,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'dateOfBirth': dateOfBirth.toIso8601String(),
      'phoneNumber': phoneNumber,
      'address': address,
      'medicalHistory': medicalHistory,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      dateOfBirth: DateTime.parse(json['dateOfBirth']),
      phoneNumber: json['phoneNumber'],
      address: json['address'],
      medicalHistory: List<String>.from(json['medicalHistory'] ?? []),
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }
}