import 'package:flutter/material.dart';
import '../../../models/disease_tracking_model.dart';

class HomeController extends ChangeNotifier {
  List<DiseaseTrackingModel> _recentReports = [];
  bool _isLoading = false;
  String _greeting = '';

  // Getters
  List<DiseaseTrackingModel> get recentReports => _recentReports;
  bool get isLoading => _isLoading;
  String get greeting => _greeting;

  HomeController() {
    _initHome();
  }

  void _initHome() {
    _setGreeting();
    _loadRecentReports();
  }

  void _setGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) {
      _greeting = 'Good Morning';
    } else if (hour < 17) {
      _greeting = 'Good Afternoon';
    } else {
      _greeting = 'Good Evening';
    }
    notifyListeners();
  }

  Future<void> _loadRecentReports() async {
    _isLoading = true;
    notifyListeners();

    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 1500));

    // Mock data
    _recentReports = [
      DiseaseTrackingModel(
        id: '1',
        userId: 'user1',
        diseaseType: 'Tuberculosis',
        reportDate: DateTime.now().subtract(const Duration(days: 7)),
        currentValues: {'chest_xray': 'improved', 'symptoms': 'mild'},
        progressScore: 7.5,
        status: ProgressStatus.improving,
        aiAnalysis: 'Chest X-ray shows significant improvement in lung clarity.',
        recommendations: ['Continue medication', 'Regular check-ups'],
      ),
      DiseaseTrackingModel(
        id: '2',
        userId: 'user1',
        diseaseType: 'Fatty Liver',
        reportDate: DateTime.now().subtract(const Duration(days: 14)),
        currentValues: {'alt': 45, 'ast': 38, 'bilirubin': 1.2},
        progressScore: 6.0,
        status: ProgressStatus.stable,
        aiAnalysis: 'Liver function tests show stable results.',
        recommendations: ['Maintain diet', 'Regular exercise'],
      ),
    ];

    _isLoading = false;
    notifyListeners();
  }

  Future<void> refreshData() async {
    await _loadRecentReports();
  }

  void navigateToReports() {
    // Navigation logic will be handled in the UI
  }

  void navigateToProgress(String diseaseType) {
    // Navigation logic will be handled in the UI
  }
}