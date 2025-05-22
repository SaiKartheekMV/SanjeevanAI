import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image_picker/image_picker.dart';

class StorageService {
  final ImagePicker _picker = ImagePicker();
  
  // Singleton pattern
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();
  
  // Get application documents directory
  Future<Directory> getApplicationDirectory() async {
    return await getApplicationDocumentsDirectory();
  }
  
  // Get temporary directory
  Future<Directory> getTemporaryDirectory() async {
    return await getTemporaryDirectory();
  }
  
  // Save file to local storage
  Future<String> saveFile(File file, String fileName) async {
    try {
      final directory = await getApplicationDirectory();
      final filePath = '${directory.path}/$fileName';
      final savedFile = await file.copy(filePath);
      return savedFile.path;
    } catch (e) {
      throw Exception('Failed to save file: $e');
    }
  }
  
  // Load file from local storage
  Future<File?> loadFile(String fileName) async {
    try {
      final directory = await getApplicationDirectory();
      final filePath = '${directory.path}/$fileName';
      final file = File(filePath);
      
      if (await file.exists()) {
        return file;
      }
      return null;
    } catch (e) {
      print('Failed to load file: $e');
      return null;
    }
  }
  
  // Delete file from local storage
  Future<bool> deleteFile(String fileName) async {
    try {
      final directory = await getApplicationDirectory();
      final filePath = '${directory.path}/$fileName';
      final file = File(filePath);
      
      if (await file.exists()) {
        await file.delete();
        return true;
      }
      return false;
    } catch (e) {
      print('Failed to delete file: $e');
      return false;
    }
  }
  
  // Pick image from gallery
  Future<File?> pickImageFromGallery() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        return File(image.path);
      }
      return null;
    } catch (e) {
      print('Failed to pick image from gallery: $e');
      return null;
    }
  }
  
  // Take photo with camera
  Future<File?> takePhotoWithCamera() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.camera);
      if (image != null) {
        return File(image.path);
      }
      return null;
    } catch (e) {
      print('Failed to take photo: $e');
      return null;
    }
  }
  
  // Pick multiple images
  Future<List<File>> pickMultipleImages() async {
    try {
      final List<XFile> images = await _picker.pickMultiImage();
      return images.map((xFile) => File(xFile.path)).toList();
    } catch (e) {
      print('Failed to pick multiple images: $e');
      return [];
    }
  }
  
  // Shared Preferences helpers
  Future<void> saveString(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }
  
  Future<String?> getString(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(key);
  }
  
  Future<void> saveInt(String key, int value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(key, value);
  }
  
  Future<int?> getInt(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(key);
  }
  
  Future<void> saveBool(String key, bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(key, value);
  }
  
  Future<bool?> getBool(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(key);
  }
  
  Future<void> removeKey(String key) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(key);
  }
  
  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
  
  // Get file size
  Future<int> getFileSize(File file) async {
    return await file.length();
  }
  
  // Check if file exists
  Future<bool> fileExists(String fileName) async {
    final directory = await getApplicationDirectory();
    final filePath = '${directory.path}/$fileName';
    final file = File(filePath);
    return await file.exists();
  }
  
  // Create backup of important files
  Future<void> createBackup() async {
    // Implementation for creating backup of important data
    print('Creating backup...');
  }
  
  // Restore from backup
  Future<void> restoreFromBackup() async {
    // Implementation for restoring from backup
    print('Restoring from backup...');
  }
}