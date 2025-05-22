// This file contains additional user-related models and utilities

class UserPreferences {
  final String theme;
  final bool notificationsEnabled;
  final String language;
  final bool biometricEnabled;
  final Map<String, dynamic> customSettings;

  UserPreferences({
    this.theme = 'system',
    this.notificationsEnabled = true,
    this.language = 'en',
    this.biometricEnabled = false,
    this.customSettings = const {},
  });

  UserPreferences copyWith({
    String? theme,
    bool? notificationsEnabled,
    String? language,
    bool? biometricEnabled,
    Map<String, dynamic>? customSettings,
  }) {
    return UserPreferences(
      theme: theme ?? this.theme,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      language: language ?? this.language,
      biometricEnabled: biometricEnabled ?? this.biometricEnabled,
      customSettings: customSettings ?? this.customSettings,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'theme': theme,
      'notificationsEnabled': notificationsEnabled,
      'language': language,
      'biometricEnabled': biometricEnabled,
      'customSettings': customSettings,
    };
  }

  factory UserPreferences.fromJson(Map<String, dynamic> json) {
    return UserPreferences(
      theme: json['theme'] ?? 'system',
      notificationsEnabled: json['notificationsEnabled'] ?? true,
      language: json['language'] ?? 'en',
      biometricEnabled: json['biometricEnabled'] ?? false,
      customSettings: json['customSettings'] ?? {},
    );
  }
}

class UserSession {
  final String userId;
  final String sessionToken;
  final DateTime loginTime;
  final DateTime lastActivity;
  final String deviceInfo;
  final bool isActive;

  UserSession({
    required this.userId,
    required this.sessionToken,
    required this.loginTime,
    required this.lastActivity,
    required this.deviceInfo,
    this.isActive = true,
  });

  bool get isExpired {
    final now = DateTime.now();
    final difference = now.difference(lastActivity);
    return difference.inHours > 24; // Session expires after 24 hours of inactivity
  }

  UserSession copyWith({
    String? userId,
    String? sessionToken,
    DateTime? loginTime,
    DateTime? lastActivity,
    String? deviceInfo,
    bool? isActive,
  }) {
    return UserSession(
      userId: userId ?? this.userId,
      sessionToken: sessionToken ?? this.sessionToken,
      loginTime: loginTime ?? this.loginTime,
      lastActivity: lastActivity ?? this.lastActivity,
      deviceInfo: deviceInfo ?? this.deviceInfo,
      isActive: isActive ?? this.isActive,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'sessionToken': sessionToken,
      'loginTime': loginTime.toIso8601String(),
      'lastActivity': lastActivity.toIso8601String(),
      'deviceInfo': deviceInfo,
      'isActive': isActive,
    };
  }

  factory UserSession.fromJson(Map<String, dynamic> json) {
    return UserSession(
      userId: json['userId'],
      sessionToken: json['sessionToken'],
      loginTime: DateTime.parse(json['loginTime']),
      lastActivity: DateTime.parse(json['lastActivity']),
      deviceInfo: json['deviceInfo'],
      isActive: json['isActive'] ?? true,
    );
  }
}