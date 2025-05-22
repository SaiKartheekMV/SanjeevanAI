import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class ReportController extends ChangeNotifier {
  List<File> _selectedImages = [];
  bool _isUploading = false;
  String _selectedReportType = 'X-Ray';
  String _selectedDiseaseType = 'Tuberculosis';
  String _notes = '';

  // Getters
  List<File> get selectedImages => _selectedImages;
  bool get isUploading => _isUploading;
  String get selectedReportType => _selectedReportType;
  String get selectedDiseaseType => _selectedDiseaseType;
  String get notes => _notes;

  final List<String> reportTypes = [
    'X-Ray',
    'Blood Test',
    'CT Scan',
    'MRI',
    'Ultrasound',
    'Other'
  ];

  final List<String> diseaseTypes = [
    'Tuberculosis',
    'Pneumonia',
    'Fatty Liver',
    'Hepatitis',
    'Other'
  ];

  void setReportType(String type) {
    _selectedReportType = type;
    notifyListeners();
  }

  void setDiseaseType(String type) {
    _selectedDiseaseType = type;
    notifyListeners();
  }

  void setNotes(String notes) {
    _notes = notes;
    notifyListeners();
  }

  Future<void> pickImages() async {
    final ImagePicker picker = ImagePicker();
    
    try {
      final List<XFile> images = await picker.pickMultiImage();
      if (images.isNotEmpty) {
        _selectedImages = images.map((xFile) => File(xFile.path)).toList();
        notifyListeners();
      }
    } catch (e) {
      // Handle error
      print('Error picking images: $e');
    }
  }

  Future<void> pickImageFromCamera() async {
    final ImagePicker picker = ImagePicker();
    
    try {
      final XFile? image = await picker.pickImage(source: ImageSource.camera);
      if (image != null) {
        _selectedImages = [File(image.path)];
        notifyListeners();
      }
    } catch (e) {
      // Handle error
      print('Error taking photo: $e');
    }
  }

  void removeImage(int index) {
    if (index >= 0 && index < _selectedImages.length) {
      _selectedImages.removeAt(index);
      notifyListeners();
    }
  }

  Future<bool> uploadReport() async {
    if (_selectedImages.isEmpty) {
      return false;
    }

    _isUploading = true;
    notifyListeners();

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 3));
      
      // Mock successful upload
      _selectedImages.clear();
      _notes = '';
      _isUploading = false;
      notifyListeners();
      
      return true;
    } catch (e) {
      _isUploading = false;
      notifyListeners();
      print('Error uploading report: $e');
      return false;
    }
  }

  void clearAll() {
    _selectedImages.clear();
    _notes = '';
    _selectedReportType = 'X-Ray';
    _selectedDiseaseType = 'Tuberculosis';
    notifyListeners();
  }
}