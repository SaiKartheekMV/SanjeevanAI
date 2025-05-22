import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

class AppLocalizations {
  AppLocalizations(this.locale);

  final Locale locale;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static const List<Locale> supportedLocales = [
    Locale('en', ''),
    Locale('hi', ''),
    Locale('ta', ''),
  ];

  Map<String, String> _localizedStrings = {};

  Future<bool> load() async {
    String jsonString = await rootBundle
        .loadString('assets/localization/${locale.languageCode}.json');
    Map<String, dynamic> jsonMap = json.decode(jsonString);

    _localizedStrings = jsonMap.map((key, value) {
      return MapEntry(key, value.toString());
    });

    return true;
  }

  String translate(String key) {
    return _localizedStrings[key] ?? key;
  }

  // Common strings for the app
  String get appName => translate('app_name');
  String get welcome => translate('welcome');
  String get login => translate('login');
  String get logout => translate('logout');
  String get username => translate('username');
  String get password => translate('password');
  String get email => translate('email');
  String get phoneNumber => translate('phone_number');
  String get submit => translate('submit');
  String get cancel => translate('cancel');
  String get save => translate('save');
  String get delete => translate('delete');
  String get edit => translate('edit');
  String get loading => translate('loading');
  String get error => translate('error');
  String get success => translate('success');
  String get retry => translate('retry');
  String get noData => translate('no_data');
  String get internetError => translate('internet_error');

  // Health Progress Tracker specific strings
  String get uploadReport => translate('upload_report');
  String get viewProgress => translate('view_progress');
  String get patientDashboard => translate('patient_dashboard');
  String get healthRecords => translate('health_records');
  String get trendAnalysis => translate('trend_analysis');
  String get followUpReminder => translate('follow_up_reminder');
  String get improvement => translate('improvement');
  String get deterioration => translate('deterioration');
  String get stable => translate('stable');
  String get criticalAlert => translate('critical_alert');
  String get nextCheckup => translate('next_checkup');
  String get abhaId => translate('abha_id');
  String get linkAbha => translate('link_abha');
  String get medicalHistory => translate('medical_history');
  String get labReports => translate('lab_reports');
  String get xrayReports => translate('xray_reports');
  String get bloodTests => translate('blood_tests');
  String get liverFunction => translate('liver_function');
  String get lungFunction => translate('lung_function');
  String get tuberculosis => translate('tuberculosis');
  String get pneumonia => translate('pneumonia');
  String get fattyLiver => translate('fatty_liver');
  String get hepatitis => translate('hepatitis');
  String get doctorNotes => translate('doctor_notes');
  String get treatmentPlan => translate('treatment_plan');
  String get medication => translate('medication');
  String get dosage => translate('dosage');
  String get frequency => translate('frequency');
  String get sideEffects => translate('side_effects');
  String get allergies => translate('allergies');
  String get emergencyContact => translate('emergency_contact');
  String get phcLocation => translate('phc_location');
  String get ashaWorker => translate('asha_worker');
  String get referToSpecialist => translate('refer_to_specialist');
  String get governmentSchemes => translate('government_schemes');
  String get pmjayEligible => translate('pmjay_eligible');
  String get freeCheckup => translate('free_checkup');
  String get voiceAssistant => translate('voice_assistant');
  String get speakTrend => translate('speak_trend');
  String get recordVoice => translate('record_voice');
  String get aiAnalysis => translate('ai_analysis');
  String get progressScore => translate('progress_score');
  String get riskLevel => translate('risk_level');
  String get lowRisk => translate('low_risk');
  String get moderateRisk => translate('moderate_risk');
  String get highRisk => translate('high_risk');
  String get reportDate => translate('report_date');
  String get testResults => translate('test_results');
  String get normalRange => translate('normal_range');
  String get abnormalValues => translate('abnormal_values');
  String get comparisonChart => translate('comparison_chart');
  String get monthlyTrend => translate('monthly_trend');
  String get yearlyProgress => translate('yearly_progress');
  String get shareReport => translate('share_report');
  String get downloadReport => translate('download_report');
  String get printReport => translate('print_report');
  String get patientProfile => translate('patient_profile');
  String get age => translate('age');
  String get gender => translate('gender');
  String get address => translate('address');
  String get occupation => translate('occupation');
  String get smokingHistory => translate('smoking_history');
  String get alcoholHistory => translate('alcohol_history');
  String get familyHistory => translate('family_history');
  String get symptoms => translate('symptoms');
  String get currentSymptoms => translate('current_symptoms');
  String get pastSymptoms => translate('past_symptoms');
  String get severity => translate('severity');
  String get mild => translate('mild');
  String get moderate => translate('moderate');
  String get severe => translate('severe');
  String get duration => translate('duration');
  String get onset => translate('onset');
  String get chronicCondition => translate('chronic_condition');
  String get acuteCondition => translate('acute_condition');
  String get consultation => translate('consultation');
  String get teleconsultation => translate('teleconsultation');
  String get inPersonVisit => translate('in_person_visit');
  String get appointmentScheduled => translate('appointment_scheduled');
  String get reminderSet => translate('reminder_set');
  String get notificationSettings => translate('notification_settings');
  String get privacySettings => translate('privacy_settings');
  String get dataSharing => translate('data_sharing');
  String get consentForm => translate('consent_form');
  String get termsAndConditions => translate('terms_and_conditions');
  String get privacyPolicy => translate('privacy_policy');
  String get helpSupport => translate('help_support');
  String get contactUs => translate('contact_us');
  String get faq => translate('faq');
  String get tutorial => translate('tutorial');
  String get aboutApp => translate('about_app');
  String get appVersion => translate('app_version');
  String get updateAvailable => translate('update_available');
  String get criticalUpdate => translate('critical_update');
  String get optionalUpdate => translate('optional_update');
  String get updateNow => translate('update_now');
  String get updateLater => translate('update_later');
  String get offlineMode => translate('offline_mode');
  String get syncData => translate('sync_data');
  String get lastSynced => translate('last_synced');
  String get syncFailed => translate('sync_failed');
  String get retrySync => translate('retry_sync');
  String get dataBackup => translate('data_backup');
  String get restoreData => translate('restore_data');
  String get exportData => translate('export_data');
  String get importData => translate('import_data');
  String get changeLanguage => translate('change_language');
  String get selectLanguage => translate('select_language');
  String get english => translate('english');
  String get hindi => translate('hindi');
  String get tamil => translate('tamil');
  String get languageChanged => translate('language_changed');
  String get restartRequired => translate('restart_required');
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['en', 'hi', 'ta'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    AppLocalizations localizations = AppLocalizations(locale);
    await localizations.load();
    return localizations;
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}