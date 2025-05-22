import 'package:intl/intl.dart';

class DateUtils {
  // Date format constants
  static const String defaultDateFormat = 'dd/MM/yyyy';
  static const String defaultTimeFormat = 'HH:mm';
  static const String defaultDateTimeFormat = 'dd/MM/yyyy HH:mm';
  static const String apiDateFormat = 'yyyy-MM-dd';
  static const String apiDateTimeFormat = 'yyyy-MM-ddTHH:mm:ss.SSSZ';
  static const String displayDateFormat = 'dd MMM yyyy';
  static const String displayDateTimeFormat = 'dd MMM yyyy, HH:mm';
  static const String monthYearFormat = 'MMM yyyy';
  static const String dayMonthFormat = 'dd MMM';

  // Get current date and time
  static DateTime get now => DateTime.now();
  
  static DateTime get today => DateTime(now.year, now.month, now.day);
  
  static DateTime get tomorrow => today.add(const Duration(days: 1));
  
  static DateTime get yesterday => today.subtract(const Duration(days: 1));

  // Format date to string
  static String formatDate(DateTime date, {String format = defaultDateFormat}) {
    return DateFormat(format).format(date);
  }

  static String formatTime(DateTime date, {String format = defaultTimeFormat}) {
    return DateFormat(format).format(date);
  }

  static String formatDateTime(DateTime date, {String format = defaultDateTimeFormat}) {
    return DateFormat(format).format(date);
  }

  // Parse string to date
  static DateTime? parseDate(String dateString, {String format = defaultDateFormat}) {
    try {
      return DateFormat(format).parse(dateString);
    } catch (e) {
      return null;
    }
  }

  static DateTime? parseDateTime(String dateTimeString, {String format = defaultDateTimeFormat}) {
    try {
      return DateFormat(format).parse(dateTimeString);
    } catch (e) {
      return null;
    }
  }

  // Parse API date formats
  static DateTime? parseApiDate(String dateString) {
    return parseDate(dateString, format: apiDateFormat);
  }

  static DateTime? parseApiDateTime(String dateTimeString) {
    try {
      return DateTime.parse(dateTimeString);
    } catch (e) {
      return null;
    }
  }

  // Format for API
  static String formatForApi(DateTime date) {
    return DateFormat(apiDateFormat).format(date);
  }

  static String formatDateTimeForApi(DateTime date) {
    return date.toIso8601String();
  }

  // Display formats
  static String formatForDisplay(DateTime date) {
    return DateFormat(displayDateFormat).format(date);
  }

  static String formatDateTimeForDisplay(DateTime date) {
    return DateFormat(displayDateTimeFormat).format(date);
  }

  static String formatMonthYear(DateTime date) {
    return DateFormat(monthYearFormat).format(date);
  }

  static String formatDayMonth(DateTime date) {
    return DateFormat(dayMonthFormat).format(date);
  }

  // Relative date formatting
  static String getRelativeDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays == -1) {
      return 'Tomorrow';
    } else if (difference.inDays > 0 && difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else if (difference.inDays < 0 && difference.inDays > -7) {
      return 'In ${-difference.inDays} days';
    } else {
      return formatForDisplay(date);
    }
  }

  static String getRelativeDateTime(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes} minutes ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hours ago';
    } else if (difference.inDays == 1) {
      return 'Yesterday at ${formatTime(date)}';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return formatDateTimeForDisplay(date);
    }
  }

  // Date comparisons
  static bool isSameDay(DateTime date1, DateTime date2) {
    return date1.year == date2.year &&
           date1.month == date2.month &&
           date1.day == date2.day;
  }

  static bool isSameMonth(DateTime date1, DateTime date2) {
    return date1.year == date2.year && date1.month == date2.month;
  }

  static bool isSameYear(DateTime date1, DateTime date2) {
    return date1.year == date2.year;
  }

  static bool isToday(DateTime date) {
    return isSameDay(date, DateTime.now());
  }

  static bool isYesterday(DateTime date) {
    return isSameDay(date, DateTime.now().subtract(const Duration(days: 1)));
  }

  static bool isTomorrow(DateTime date) {
    return isSameDay(date, DateTime.now().add(const Duration(days: 1)));
  }

  static bool isThisWeek(DateTime date) {
    final now = DateTime.now();
    final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
    final endOfWeek = startOfWeek.add(const Duration(days: 6));
    return date.isAfter(startOfWeek.subtract(const Duration(days: 1))) &&
           date.isBefore(endOfWeek.add(const Duration(days: 1)));
  }

  static bool isThisMonth(DateTime date) {
    return isSameMonth(date, DateTime.now());
  }

  static bool isThisYear(DateTime date) {
    return isSameYear(date, DateTime.now());
  }

  // Date calculations
  static DateTime addDays(DateTime date, int days) {
    return date.add(Duration(days: days));
  }

  static DateTime subtractDays(DateTime date, int days) {
    return date.subtract(Duration(days: days));
  }

  static DateTime addMonths(DateTime date, int months) {
    int year = date.year;
    int month = date.month + months;
    
    while (month > 12) {
      month -= 12;
      year++;
    }
    while (month < 1) {
      month += 12;
      year--;
    }
    
    return DateTime(year, month, date.day, date.hour, date.minute, date.second, date.millisecond);
  }

  static DateTime subtractMonths(DateTime date, int months) {
    return addMonths(date, -months);
  }

  static DateTime addYears(DateTime date, int years) {
    return DateTime(date.year + years, date.month, date.day, date.hour, date.minute, date.second, date.millisecond);
  }

  static DateTime subtractYears(DateTime date, int years) {
    return addYears(date, -years);
  }

  // Get start and end of periods
  static DateTime getStartOfDay(DateTime date) {
    return DateTime(date.year, date.month, date.day);
  }

  static DateTime getEndOfDay(DateTime date) {
    return DateTime(date.year, date.month, date.day, 23, 59, 59, 999);
  }

  static DateTime getStartOfWeek(DateTime date) {
    return date.subtract(Duration(days: date.weekday - 1));
  }

  static DateTime getEndOfWeek(DateTime date) {
    return getStartOfWeek(date).add(const Duration(days: 6));
  }

  static DateTime getStartOfMonth(DateTime date) {
    return DateTime(date.year, date.month, 1);
  }

  static DateTime getEndOfMonth(DateTime date) {
    return DateTime(date.year, date.month + 1, 0);
  }

  static DateTime getStartOfYear(DateTime date) {
    return DateTime(date.year, 1, 1);
  }

  static DateTime getEndOfYear(DateTime date) {
    return DateTime(date.year, 12, 31);
  }

  // Calculate age
  static int calculateAge(DateTime birthDate) {
    final now = DateTime.now();
    int age = now.year - birthDate.year;
    
    if (now.month < birthDate.month || 
        (now.month == birthDate.month && now.day < birthDate.day)) {
      age--;
    }
    
    return age;
  }

  static String getAgeString(DateTime birthDate) {
    final age = calculateAge(birthDate);
    return '$age years old';
  }

  // Duration calculations
  static Duration getDurationBetween(DateTime start, DateTime end) {
    return end.difference(start);
  }

  static int getDaysBetween(DateTime start, DateTime end) {
    return end.difference(start).inDays;
  }

  static int getHoursBetween(DateTime start, DateTime end) {
    return end.difference(start).inHours;
  }

  static int getMinutesBetween(DateTime start, DateTime end) {
    return end.difference(start).inMinutes;
  }

  // Health-specific date utilities
  static DateTime getNextCheckupDate(DateTime lastCheckup, int intervalDays) {
    return lastCheckup.add(Duration(days: intervalDays));
  }

  static bool isCheckupDue(DateTime lastCheckup, int intervalDays) {
    final nextCheckup = getNextCheckupDate(lastCheckup, intervalDays);
    return DateTime.now().isAfter(nextCheckup);
  }

  static int getDaysUntilNextCheckup(DateTime lastCheckup, int intervalDays) {
    final nextCheckup = getNextCheckupDate(lastCheckup, intervalDays);
    return getDaysBetween(DateTime.now(), nextCheckup);
  }

  static List<DateTime> getReportDatesInRange(DateTime start, DateTime end) {
    List<DateTime> dates = [];
    DateTime current = start;
    
    while (current.isBefore(end) || isSameDay(current, end)) {
      dates.add(current);
      current = current.add(const Duration(days: 1));
    }
    
    return dates;
  }

  static List<DateTime> getMonthlyReportDates(DateTime start, DateTime end) {
    List<DateTime> dates = [];
    DateTime current = DateTime(start.year, start.month, 1);
    
    while (current.isBefore(end) || isSameMonth(current, end)) {
      dates.add(current);
      current = addMonths(current, 1);
    }
    
    return dates;
  }

  // Medication reminder utilities
  static List<DateTime> getMedicationReminderTimes(
    DateTime startDate, 
    int frequencyPerDay, 
    int durationDays
  ) {
    List<DateTime> reminderTimes = [];
    final interval = 24 ~/ frequencyPerDay;
    
    for (int day = 0; day < durationDays; day++) {
      final currentDate = startDate.add(Duration(days: day));
      
      for (int reminder = 0; reminder < frequencyPerDay; reminder++) {
        final reminderTime = DateTime(
          currentDate.year,
          currentDate.month,
          currentDate.day,
          8 + (reminder * interval), // Start at 8 AM
          0,
        );
        reminderTimes.add(reminderTime);
      }
    }
    
    return reminderTimes;
  }

  static DateTime getNextMedicationTime(List<DateTime> medicationTimes) {
    final now = DateTime.now();
    
    for (final time in medicationTimes) {
      if (time.isAfter(now)) {
        return time;
      }
    }
    
    return medicationTimes.first; // If no future time, return first
  }

  // Report analysis date utilities
  static List<DateTime> getReportComparisonDates(DateTime latestReport, int monthsBack) {
    List<DateTime> dates = [];
    
    for (int i = 0; i <= monthsBack; i++) {
      dates.add(subtractMonths(latestReport, i));
    }
    
    return dates.reversed.toList();
  }

  static String getProgressPeriod(DateTime start, DateTime end) {
    final days = getDaysBetween(start, end);
    
    if (days < 30) {
      return '$days days';
    } else if (days < 365) {
      final months = (days / 30).round();
      return '$months months';
    } else {
      final years = (days / 365).round();
      return '$years years';
    }
  }

  // Validation utilities
  static bool isValidDate(String dateString, {String format = defaultDateFormat}) {
    return parseDate(dateString, format: format) != null;
  }

  static bool isValidDateTime(String dateTimeString, {String format = defaultDateTimeFormat}) {
    return parseDateTime(dateTimeString, format: format) != null;
  }

  static bool isDateInFuture(DateTime date) {
    return date.isAfter(DateTime.now());
  }

  static bool isDateInPast(DateTime date) {
    return date.isBefore(DateTime.now());
  }

  static bool isDateWithinRange(DateTime date, DateTime start, DateTime end) {
    return date.isAfter(start.subtract(const Duration(days: 1))) &&
           date.isBefore(end.add(const Duration(days: 1)));
  }

  // Date range utilities for health tracking
  static DateTimeRange getLastWeekRange() {
    final end = DateTime.now();
    final start = end.subtract(const Duration(days: 7));
    return DateTimeRange(start: start, end: end);
  }

  static DateTimeRange getLastMonthRange() {
    final end = DateTime.now();
    final start = subtractMonths(end, 1);
    return DateTimeRange(start: start, end: end);
  }

  static DateTimeRange getLastYearRange() {
    final end = DateTime.now();
    final start = subtractYears(end, 1);
    return DateTimeRange(start: start, end: end);
  }

  static DateTimeRange getCustomRange(DateTime start, DateTime end) {
    return DateTimeRange(start: start, end: end);
  }
}

class DateTimeRange {
  final DateTime start;
  final DateTime end;

  DateTimeRange({required this.start, required this.end});

  Duration get duration => end.difference(start);
  int get days => duration.inDays;
  bool get isValid => start.isBefore(end);

  bool contains(DateTime date) {
    return DateUtils.isDateWithinRange(date, start, end);
  }

  @override
  String toString() {
    return '${DateUtils.formatForDisplay(start)} - ${DateUtils.formatForDisplay(end)}';
  }
}