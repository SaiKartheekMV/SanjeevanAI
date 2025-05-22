import 'package:flutter_tts/flutter_tts.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

class SpeechService {
  // Text-to-Speech
  late FlutterTts _flutterTts;
  
  // Speech-to-Text
  late stt.SpeechToText _speechToText;
  bool _isListening = false;
  String _recognizedText = '';
  
  // Singleton pattern
  static final SpeechService _instance = SpeechService._internal();
  factory SpeechService() => _instance;
  SpeechService._internal();
  
  // Getters
  bool get isListening => _isListening;
  String get recognizedText => _recognizedText;
  
  // Initialize
  Future<void> initialize() async {
    // Initialize TTS