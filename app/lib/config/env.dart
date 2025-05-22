class Environment {
  static const String development = "development";
  static const String staging = "staging";
  static const String production = "production";
  
  static const String current = development;
  
  static bool get isDevelopment => current == development;
  static bool get isStaging => current == staging;
  static bool get isProduction => current == production;
  
  // API URLs based on environment
  static String get apiUrl {
    switch (current) {
      case development:
        return "http://localhost:8000/api";
      case staging:
        return "https://staging-api.sanjeevanai.com/api";
      case production:
        return "https://api.sanjeevanai.com/api";
      default:
        return "http://localhost:8000/api";
    }
  }
}