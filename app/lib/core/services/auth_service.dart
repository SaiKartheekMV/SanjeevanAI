import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';
import '../../models/user_model.dart';

class AuthService {
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';
  
  final ApiService _apiService = ApiService();
  
  // Singleton pattern
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();
  
  // Current user and token
  String? _token;
  UserModel? _currentUser;
  
  // Getters
  String? get token => _token;
  UserModel? get currentUser => _currentUser;
  bool get isLoggedIn => _token != null && _currentUser != null;
  
  // Initialize - Check if user is already logged in
  Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString(_tokenKey);
    
    final userData = prefs.getString(_userKey);
    if (userData != null) {
      _currentUser = UserModel.fromJson(jsonDecode(userData));
    }
  }
  
  // Login
  Future<bool> login(String email, String password) async {
    try {
      final response = await _apiService.post('/auth/login', {
        'email': email,
        'password': password,
      });
      
      _token = response['token'];
      _currentUser = UserModel.fromJson(response['user']);
      
      // Save to local storage
      await _saveAuthData();
      
      return true;
    } catch (e) {
      print('Login error: $e');
      return false;
    }
  }
  
  // Register
  Future<bool> register({
    required String name,
    required String email,
    required String password,
    required String phone,
    String? abhaId,
  }) async {
    try {
      final response = await _apiService.post('/auth/register', {
        'name': name,
        'email': email,
        'password': password,
        'phone': phone,
        'abha_id': abhaId,
      });
      
      _token = response['token'];
      _currentUser = UserModel.fromJson(response['user']);
      
      // Save to local storage
      await _saveAuthData();
      
      return true;
    } catch (e) {
      print('Register error: $e');
      return false;
    }
  }
  
  // Logout
  Future<void> logout() async {
    try {
      if (_token != null) {
        await _apiService.post('/auth/logout', {}, token: _token);
      }
    } catch (e) {
      print('Logout error: $e');
    } finally {
      await _clearAuthData();
    }
  }
  
  // Forgot Password
  Future<bool> forgotPassword(String email) async {
    try {
      await _apiService.post('/auth/forgot-password', {
        'email': email,
      });
      return true;
    } catch (e) {
      print('Forgot password error: $e');
      return false;
    }
  }
  
  // Update Profile
  Future<bool> updateProfile(Map<String, dynamic> profileData) async {
    try {
      final response = await _apiService.put(
        '/auth/profile',
        profileData,
        token: _token,
      );
      
      _currentUser = UserModel.fromJson(response['user']);
      await _saveUserData();
      
      return true;
    } catch (e) {
      print('Update profile error: $e');
      return false;
    }
  }
  
  // ABHA Integration
  Future<bool> linkAbhaId(String abhaId) async {
    try {
      final response = await _apiService.post(
        '/auth/link-abha',
        {'abha_id': abhaId},
        token: _token,
      );
      
      _currentUser = UserModel.fromJson(response['user']);
      await _saveUserData();
      
      return true;
    } catch (e) {
      print('Link ABHA error: $e');
      return false;
    }
  }
  
  // Private methods
  Future<void> _saveAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    if (_token != null) {
      await prefs.setString(_tokenKey, _token!);
    }
    await _saveUserData();
  }
  
  Future<void> _saveUserData() async {
    final prefs = await SharedPreferences.getInstance();
    if (_currentUser != null) {
      await prefs.setString(_userKey, jsonEncode(_currentUser!.toJson()));
    }
  }
  
  Future<void> _clearAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
    _token = null;
    _currentUser = null;
  }
}