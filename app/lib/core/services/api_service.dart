import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../config/env.dart';

class ApiService {
  static const String _baseUrl = Environment.apiUrl;
  static const Duration _timeout = Duration(seconds: 30);
  
  // Singleton pattern
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();
  
  // Headers
  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  Map<String, String> _headersWithAuth(String token) => {
    ..._headers,
    'Authorization': 'Bearer $token',
  };
  
  // GET Request
  Future<Map<String, dynamic>> get(String endpoint, {String? token}) async {
    try {
      final response = await http
          .get(
            Uri.parse('$_baseUrl$endpoint'),
            headers: token != null ? _headersWithAuth(token) : _headers,
          )
          .timeout(_timeout);
      
      return _handleResponse(response);
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // POST Request
  Future<Map<String, dynamic>> post(
    String endpoint,
    Map<String, dynamic> data, {
    String? token,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('$_baseUrl$endpoint'),
            headers: token != null ? _headersWithAuth(token) : _headers,
            body: jsonEncode(data),
          )
          .timeout(_timeout);
      
      return _handleResponse(response);
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // PUT Request
  Future<Map<String, dynamic>> put(
    String endpoint,
    Map<String, dynamic> data, {
    String? token,
  }) async {
    try {
      final response = await http
          .put(
            Uri.parse('$_baseUrl$endpoint'),
            headers: token != null ? _headersWithAuth(token) : _headers,
            body: jsonEncode(data),
          )
          .timeout(_timeout);
      
      return _handleResponse(response);
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // DELETE Request
  Future<Map<String, dynamic>> delete(String endpoint, {String? token}) async {
    try {
      final response = await http
          .delete(
            Uri.parse('$_baseUrl$endpoint'),
            headers: token != null ? _headersWithAuth(token) : _headers,
          )
          .timeout(_timeout);
      
      return _handleResponse(response);
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // File Upload
  Future<Map<String, dynamic>> uploadFile(
    String endpoint,
    File file, {
    String? token,
    Map<String, String>? additionalFields,
  }) async {
    try {
      var request = http.MultipartRequest('POST', Uri.parse('$_baseUrl$endpoint'));
      
      // Add headers
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }
      
      // Add file
      request.files.add(await http.MultipartFile.fromPath('file', file.path));
      
      // Add additional fields
      if (additionalFields != null) {
        request.fields.addAll(additionalFields);
      }
      
      final streamedResponse = await request.send().timeout(_timeout);
      final response = await http.Response.fromStream(streamedResponse);
      
      return _handleResponse(response);
    } catch (e) {
      throw _handleError(e);
    }
  }
  
  // Handle Response
  Map<String, dynamic> _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    } else {
      throw ApiException(
        statusCode: response.statusCode,
        message: response.body,
      );
    }
  }
  
  // Handle Errors
  Exception _handleError(dynamic error) {
    if (error is SocketException) {
      return NetworkException('No internet connection');
    } else if (error is http.ClientException) {
      return NetworkException('Network error occurred');
    } else if (error is ApiException) {
      return error;
    } else {
      return GeneralException('An unexpected error occurred');
    }
  }
}

// Custom Exceptions
class ApiException implements Exception {
  final int statusCode;
  final String message;
  
  ApiException({required this.statusCode, required this.message});
  
  @override
  String toString() => 'ApiException: $statusCode - $message';
}

class NetworkException implements Exception {
  final String message;
  
  NetworkException(this.message);
  
  @override
  String toString() => 'NetworkException: $message';
}

class GeneralException implements Exception {
  final String message;
  
  GeneralException(this.message);
  
  @override
  String toString() => 'GeneralException: $message';
}