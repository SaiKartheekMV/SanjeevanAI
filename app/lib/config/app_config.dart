class AppConfig {
  static const String appName = "SanjeevanAI";
  static const String version = "1.0.0";
  static const String apiBaseUrl = "https://api.sanjeevai.com";
  static const bool debugMode = true;
  
  // AI Model Configuration
  static const String ocrModelPath = "assets/models/ocr_model.tflite";
  static const String xrayModelPath = "assets/models/xray_model.tflite";
  
  // Firebase Configuration
  static const String firebaseProjectId = "sanjeevanai-health";
  
  // ABHA Configuration
  static const String abhaApiUrl = "https://abha.abdm.gov.in";
  static const String abhaClientId = "your-abha-client-id";
}