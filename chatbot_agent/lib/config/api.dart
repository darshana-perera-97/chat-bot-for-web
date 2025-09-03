class ApiConfig {
  static const String baseUrl = 'http://localhost:3333';
  
  // Session endpoints
  static String getSessionsUrl() => '$baseUrl/api/sessions';
  
  // Chat endpoints
  static String getChatHistoryUrl(String sessionId) => '$baseUrl/api/chat/history/$sessionId';
  static String getChatUrl() => '$baseUrl/api/chat';
}
