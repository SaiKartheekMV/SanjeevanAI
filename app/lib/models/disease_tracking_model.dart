class DiseaseTrackingModel {
  final String id;
  final String userId;
  final String diseaseType;
  final DateTime reportDate;
  final Map<String, dynamic> currentValues;
  final Map<String, dynamic>? previousValues;
  final double progressScore;
  final ProgressStatus status;
  final String? aiAnalysis;
  final List<String> recommendations;

  DiseaseTrackingModel({
    required this.id,
    required this.userId,
    required this.diseaseType,
    required this.reportDate,
    required this.currentValues,
    this.previousValues,
    required this.progressScore,
    required this.status,
    this.aiAnalysis,
    this.recommendations = const [],
  });

  factory DiseaseTrackingModel.fromJson(Map<String, dynamic> json) {
    return DiseaseTrackingModel(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      diseaseType: json['diseaseType'] ?? '',
      reportDate: DateTime.parse(json['reportDate'] ?? DateTime.now().toIso8601String()),
      currentValues: Map<String, dynamic>.from(json['currentValues'] ?? {}),
      previousValues: json['previousValues'] != null 
        ? Map<String, dynamic>.from(json['previousValues'])
        : null,
      progressScore: (json['progressScore'] ?? 0.0).toDouble(),
      status: ProgressStatus.values.firstWhere(
        (status) => status.toString() == 'ProgressStatus.${json['status']}',
        orElse: () => ProgressStatus.stable,
      ),
      aiAnalysis: json['aiAnalysis'],
      recommendations: List<String>.from(json['recommendations'] ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'diseaseType': diseaseType,
      'reportDate': reportDate.toIso8601String(),
      'currentValues': currentValues,
      'previousValues': previousValues,
      'progressScore': progressScore,
      'status': status.toString().split('.').last,
      'aiAnalysis': aiAnalysis,
      'recommendations': recommendations,
    };
  }
}

enum ProgressStatus {
  improving,
  stable,
  worsening,
  critical,
}

enum DiseaseType {
  tuberculosis,
  pneumonia,
  fattyLiver,
  hepatitis,
  other,
}