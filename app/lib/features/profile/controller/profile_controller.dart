import 'package:flutter/material.dart';
import '../../../models/user_model.dart';

class ProfileController extends ChangeNotifier {
  UserModel? _user;
  bool _isLoading = false;
  bool _isEditing = false;

  // Getters
  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  bool get isEditing => _isEditing;

  ProfileController() {
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    _isLoading = true;
    notifyListeners();

    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 1000));

    // Mock user data
    _user = UserModel(
      id: 'user123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      abhaId: 'ABHA123456789',
      createdAt: DateTime.now().subtract(const Duration(days: 30)),
      userType: UserType.patient,
    );

    _isLoading = false;
    notifyListeners();
  }

  void toggleEditing() {
    _isEditing = !_isEditing;
    notifyListeners();
  }

  Future<bool> updateProfile({
    required String name,
    required String phone,
    String? abhaId,
  }) async {
    if (_user == null) return false;

    _isLoading = true;
    notifyListeners();

    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 1500));

    _user = _user!.copyWith(
      name: name,
      phone: phone,
      abhaId: abhaId,
    );

    _isLoading = false;
    _isEditing = false;
    notifyListeners();

    return true;
  }

  Future<void> refreshProfile() async {
    await _loadUserProfile();
  }

  void logout() {
    _user = null;
    notifyListeners();
  }
}