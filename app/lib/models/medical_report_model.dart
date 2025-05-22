enum ReportType {
  xray,
  bloodTest,
  liverFunction,
  ctScan,
  mri,
  ultrasound,
  ecg,
  echo,
  pulmonaryFunction,
  sputumTest,
  other
}

enum ReportStatus {
  pending,
  processed,
  analyzed,
  error,
  expired
}

enum DiseaseProgression {
  improved,
  stable,
  worsened,
  unclear,
  newDiagnosis
}

class MedicalReport {
  final String id;
  final String patientId;
  final String patientName;
  final String abhaId;
  final ReportType reportType;
  final String reportTitle;
  final DateTime reportDate;
  final DateTime uploadedAt;
  final String uploadedBy;
  final String hospitalName;
  final String doctorName;
  final String? doctorRegNumber;
  final List<String> fileUrls;
  final List<String> imageUrls;
  final ReportStatus status;
  final Map<String, dynamic>? extractedData;
  final String? ocrText;
  final List<LabValue> labValues;
  final List<String> findings;
  final List<String> impressions;
  final String? diagnosis;
  final String? recommendations;
  final AIAnalysis? aiAnalysis;
  final ProgressComparison? progressComparison;
  final Map<String, dynamic>? metadata;

  MedicalReport({
    required this.id,
    required this.patientId,
    required this.patientName,
    required this.abhaId,
    required this.reportType,
    required this.reportTitle,
    required this.reportDate,
    required this.uploadedAt,
    required this.uploadedBy,
    required this.hospitalName,
    required this.doctorName,
    this.doctorRegNumber,
    this.fileUrls = const [],
    this.imageUrls = const [],
    this.status = ReportStatus.pending,
    this.extractedData,
    this.ocrText,
    this.labValues = const [],
    this.findings = const [],
    this.impressions = const [],
    this.diagnosis,
    this.recommendations,
    this.aiAnalysis,
    this.progressComparison,
    this.metadata,
  });

  String get reportTypeDisplayName {
    switch (reportType) {
      case ReportType.xray:
        return 'X-Ray';
      case ReportType.bloodTest:
        return 'Blood Test';
      case ReportType.liverFunction:
        return 'Liver Function Test';
      case ReportType.ctScan:
        return 'CT Scan';
      case ReportType.mri:
        return 'MRI';
      case ReportType.ultrasound:
        return 'Ultrasound';
      case ReportType.ecg:
        return 'ECG';
      case ReportType.echo:
        return 'Echocardiogram';
      case ReportType.pulmonaryFunction:
        return 'Pulmonary Function Test';
      case ReportType.sputumTest:
        return 'Sputum Test';
      case ReportType.other:
        return 'Other';
    }
  }

  bool get hasAIAnalysis => aiAnalysis != null;
  bool get hasProgressComparison => progressComparison != null;
  bool get isProcessed => status == ReportStatus.processed || status == ReportStatus.analyzed;
  
  factory MedicalReport.fromJson(Map<String, dynamic> json) {
    return MedicalReport(
      id: json['id'],
      patientId: json['patient_id'],
      patientName: json['patient_name'],
      abhaId: json['abha_id'],
      reportType: ReportType.values.firstWhere(
        (e) => e.toString().split('.').last == json['report_type'],
        orElse: () => ReportType.other,
      ),
      reportTitle: json['report_title'],
      reportDate: DateTime.parse(json['report_date']),
      uploadedAt: DateTime.parse(json['uploaded_at']),
      uploadedBy: json['uploaded_by'],
      hospitalName: json['hospital_name'],
      doctorName: json['doctor_name'],
      doctorRegNumber: json['doctor_reg_number'],
      fileUrls: List<String>.from(json['file_urls'] ?? []),
      imageUrls: List<String>.from(json['image_urls'] ?? []),
      status: ReportStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
        orElse: () => ReportStatus.pending,
      ),
      extractedData: json['extracted_data'],
      ocrText: json['ocr_text'],
      labValues: (json['lab_values'] as List<dynamic>?)
          ?.map((e) => LabValue.fromJson(e))
          .toList() ?? [],
      findings: List<String>.from(json['findings'] ?? []),
      impressions: List<String>.from(json['impressions'] ?? []),
      diagnosis: json['diagnosis'],
      recommendations: json['recommendations'],
      aiAnalysis: json['ai_analysis'] != null 
          ? AIAnalysis.fromJson(json['ai_analysis']) 
          : null,
      progressComparison: json['progress_comparison'] != null
          ? ProgressComparison.fromJson(json['progress_comparison'])
          : null,
      metadata: json['metadata'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'patient_id': patientId,
      'patient_name': patientName,
      'abha_id': abhaId,
      'report_type': reportType.toString().split('.').last,
      'report_title': reportTitle,
      'report_date': reportDate.toIso8601String(),
      'uploaded_at': uploadedAt.toIso8601String(),
      'uploaded_by': uploadedBy,
      'hospital_name': hospitalName,
      'doctor_name': doctorName,
      'doctor_reg_number': doctorRegNumber,
      'file_urls': fileUrls,
      'image_urls': imageUrls,
      'status': status.toString().split('.').last,
      'extracted_data': extractedData,
      'ocr_text': ocrText,
      'lab_values': labValues.map((e) => e.toJson()).toList(),
      'findings': findings,
      'impressions': impressions,
      'diagnosis': diagnosis,
      'recommendations': recommendations,
      'ai_analysis': aiAnalysis?.toJson(),
      'progress_comparison': progressComparison?.toJson(),
      'metadata': metadata,
    };
  }
}

class LabValue {
  final String testName;
  final String value;
  final String unit;
  final String? referenceRange;
  final bool isAbnormal;
  final String? flag; // H, L, Normal
  final String? notes;

  LabValue({
    required this.testName,
    required this.value,
    required this.unit,
    this.referenceRange,
    this.isAbnormal = false,
    this.flag,
    this.notes,
  });

  factory LabValue.fromJson(Map<String, dynamic> json) {
    return LabValue(
      testName: json['test_name'],
      value: json['value'],
      unit: json['unit'],
      referenceRange: json['reference_range'],
      isAbnormal: json['is_abnormal'] ?? false,
      flag: json['flag'],
      notes: json['notes'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'test_name': testName,
      'value': value,
      'unit': unit,
      'reference_range': referenceRange,
      'is_abnormal': isAbnormal,
      'flag': flag,
      'notes': notes,
    };
  }
}

class AIAnalysis {
  final String id;
  final String reportId;
  final String modelVersion;
  final DateTime analyzedAt;
  final double confidenceScore;
  final List<String> detectedConditions;
  final Map<String, double> conditionProbabilities;
  final List<String> keyFindings;
  final String? riskAssessment;
  final List<String> recommendations;
  final Map<String, dynamic>? technicalDetails;

  AIAnalysis({
    required this.id,
    required this.reportId,
    required this.modelVersion,
    required this.analyzedAt,
    required this.confidenceScore,
    this.detectedConditions = const [],
    this.conditionProbabilities = const {},
    this.keyFindings = const [],
    this.riskAssessment,
    this.recommendations = const [],
    this.technicalDetails,
  });

  factory AIAnalysis.fromJson(Map<String, dynamic> json) {
    return AIAnalysis(
      id: json['id'],
      reportId: json['report_id'],
      modelVersion: json['model_version'],
      analyzedAt: DateTime.parse(json['analyzed_at']),
      confidenceScore: json['confidence_score'].toDouble(),
      detectedConditions: List<String>.from(json['detected_conditions'] ?? []),
      conditionProbabilities: Map<String, double>.from(
        json['condition_probabilities']?.map((k, v) => MapEntry(k, v.toDouble())) ?? {}
      ),
      keyFindings: List<String>.from(json['key_findings'] ?? []),
      riskAssessment: json['risk_assessment'],
      recommendations: List<String>.from(json['recommendations'] ?? []),
      technicalDetails: json['technical_details'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'report_id': reportId,
      'model_version': modelVersion,
      'analyzed_at': analyzedAt.toIso8601String(),
      'confidence_score': confidenceScore,
      'detected_conditions': detectedConditions,
      'condition_probabilities': conditionProbabilities,
      'key_findings': keyFindings,
      'risk_assessment': riskAssessment,
      'recommendations': recommendations,
      'technical_details': technicalDetails,
    };
  }
}

class ProgressComparison {
  final String id;
  final String currentReportId;
  final String previousReportId;
  final DateTime comparedAt;
  final DiseaseProgression overallProgression;
  final double progressScore; // -1 to 1, negative is worse, positive is better
  final List<ComparisonMetric> metrics;
  final List<String> keyChanges;
  final String summary;
  final List<String> alerts;
  final Map<String, dynamic>? visualComparison;

  ProgressComparison({
    required this.id,
    required this.currentReportId,
    required this.previousReportId,
    required this.comparedAt,
    required this.overallProgression,
    required this.progressScore,
    this.metrics = const [],
    this.keyChanges = const [],
    required this.summary,
    this.alerts = const [],
    this.visualComparison,
  });

  String get progressionDisplayText {
    switch (overallProgression) {
      case DiseaseProgression.improved:
        return 'Improved';
      case DiseaseProgression.stable:
        return 'Stable';
      case DiseaseProgression.worsened:
        return 'Worsened';
      case DiseaseProgression.unclear:
        return 'Unclear';
      case DiseaseProgression.newDiagnosis:
        return 'New Diagnosis';
    }
  }

  factory ProgressComparison.fromJson(Map<String, dynamic> json) {
    return ProgressComparison(
      id: json['id'],
      currentReportId: json['current_report_id'],
      previousReportId: json['previous_report_id'],
      comparedAt: DateTime.parse(json['compared_at']),
      overallProgression: DiseaseProgression.values.firstWhere(
        (e) => e.toString().split('.').last == json['overall_progression'],
        orElse: () => DiseaseProgression.unclear,
      ),
      progressScore: json['progress_score'].toDouble(),
      metrics: (json['metrics'] as List<dynamic>?)
          ?.map((e) => ComparisonMetric.fromJson(e))
          .toList() ?? [],
      keyChanges: List<String>.from(json['key_changes'] ?? []),
      summary: json['summary'],
      alerts: List<String>.from(json['alerts'] ?? []),
      visualComparison: json['visual_comparison'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'current_report_id': currentReportId,
      'previous_report_id': previousReportId,
      'compared_at': comparedAt.toIso8601String(),
      'overall_progression': overallProgression.toString().split('.').last,
      'progress_score': progressScore,
      'metrics': metrics.map((e) => e.toJson()).toList(),
      'key_changes': keyChanges,
      'summary': summary,
      'alerts': alerts,
      'visual_comparison': visualComparison,
    };
  }
}

class ComparisonMetric {
  final String metricName;
  final String previousValue;
  final String currentValue;
  final String unit;
  final double changePercentage;
  final String changeDirection; // 'improved', 'worsened', 'stable'
  final bool isSignificant;
  final String? interpretation;

  ComparisonMetric({
    required this.metricName,
    required this.previousValue,
    required this.currentValue,
    required this.unit,
    required this.changePercentage,
    required this.changeDirection,
    this.isSignificant = false,
    this.interpretation,
  });

  factory ComparisonMetric.fromJson(Map<String, dynamic> json) {
    return ComparisonMetric(
      metricName: json['metric_name'],
      previousValue: json['previous_value'],
      currentValue: json['current_value'],
      unit: json['unit'],
      changePercentage: json['change_percentage'].toDouble(),
      changeDirection: json['change_direction'],
      isSignificant: json['is_significant'] ?? false,
      interpretation: json['interpretation'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'metric_name': metricName,
      'previous_value': previousValue,
      'current_value': currentValue,
      'unit': unit,
      'change_percentage': changePercentage,
      'change_direction': changeDirection,
      'is_significant': isSignificant,
      'interpretation': interpretation,
    };
  }
}