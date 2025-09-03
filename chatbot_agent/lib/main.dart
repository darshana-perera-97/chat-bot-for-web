import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'config/api.dart';

void main() {
  runApp(const ChatbotAgentApp());
}

class ChatbotAgentApp extends StatelessWidget {
  const ChatbotAgentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Chatbot Agent',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    // Navigate to main app after 2 seconds
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const MainApp()),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.chat_bubble_outline,
              size: 100,
              color: Colors.white,
            ),
            const SizedBox(height: 20),
            const Text(
              'Chatbot Agent',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'NegGenAi-Solar',
              style: TextStyle(
                fontSize: 18,
                color: Colors.white70,
              ),
            ),
            const SizedBox(height: 40),
            const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
          ],
        ),
      ),
    );
  }
}

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    const DashboardPage(),
    const ChatsPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat),
            label: 'Chats',
          ),
        ],
      ),
    );
  }
}

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  Map<String, dynamic> analytics = {
    'websites': 1,
    'sessions': 0,
    'chats': 0,
    'recurringUsers': 0,
  };
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchAnalytics();
  }

  Future<void> fetchAnalytics() async {
    try {
      final response = await http.get(
        Uri.parse(ApiConfig.getSessionsUrl()),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final sessions = data['sessions'] as List;
        
        // Calculate analytics
        int totalSessions = sessions.length;
        int totalChats = 0;
        Map<String, int> userSessions = {};

        for (var session in sessions) {
          // Fetch chat history for each session
          try {
            final historyResponse = await http.get(
              Uri.parse(ApiConfig.getChatHistoryUrl(session['chatId'])),
            );
            if (historyResponse.statusCode == 200) {
              final historyData = json.decode(historyResponse.body);
              final messages = historyData['messages'] as List;
              totalChats += messages.length;
              
              // Track user sessions
              final userId = session['chatId'];
              userSessions[userId] = (userSessions[userId] ?? 0) + 1;
            }
          } catch (e) {
            // Continue with other sessions if one fails
          }
        }

        final recurringUsers = userSessions.values.where((count) => count > 1).length;

        setState(() {
          analytics = {
            'websites': 1,
            'sessions': totalSessions,
            'chats': totalChats,
            'recurringUsers': recurringUsers,
          };
          isLoading = false;
        });
      }
    } catch (e) {
    setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Analytics Overview',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Expanded(
                    child: GridView.count(
                      crossAxisCount: 2,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      children: [
                        _buildAnalyticsCard(
                          'Websites',
                          analytics['websites'].toString(),
                          Icons.language,
                          Colors.blue,
                        ),
                        _buildAnalyticsCard(
                          'Sessions',
                          analytics['sessions'].toString(),
                          Icons.people,
                          Colors.green,
                        ),
                        _buildAnalyticsCard(
                          'Chats',
                          analytics['chats'].toString(),
                          Icons.chat,
                          Colors.orange,
                        ),
                        _buildAnalyticsCard(
                          'Recurring Users',
                          analytics['recurringUsers'].toString(),
                          Icons.repeat,
                          Colors.purple,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildAnalyticsCard(String title, String value, IconData icon, Color color) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 40,
              color: color,
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: const TextStyle(
                fontSize: 14,
                color: Colors.grey,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class ChatsPage extends StatefulWidget {
  const ChatsPage({super.key});

  @override
  State<ChatsPage> createState() => _ChatsPageState();
}

class _ChatsPageState extends State<ChatsPage> {
  List<dynamic> sessions = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchSessions();
  }

  Future<void> fetchSessions() async {
    try {
      final response = await http.get(
        Uri.parse(ApiConfig.getSessionsUrl()),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          sessions = data['sessions'] as List;
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Chats'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : sessions.isEmpty
              ? const Center(
                  child: Text(
                    'No chat sessions available',
                    style: TextStyle(fontSize: 16),
                  ),
                )
              : ListView.builder(
                  itemCount: sessions.length,
                  itemBuilder: (context, index) {
                    final session = sessions[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: ListTile(
                        leading: const CircleAvatar(
                          child: Icon(Icons.chat),
                        ),
                        title: Text('Session ${session['chatId'].toString().substring(0, 8)}...'),
                        subtitle: Text('Created: ${session['createdAt']}'),
                        trailing: const Icon(Icons.arrow_forward_ios),
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => ChatDetailPage(
                                sessionId: session['chatId'],
                                sessionTitle: 'Session ${session['chatId'].toString().substring(0, 8)}...',
                              ),
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
    );
  }
}

class ChatDetailPage extends StatefulWidget {
  final String sessionId;
  final String sessionTitle;

  const ChatDetailPage({
    super.key,
    required this.sessionId,
    required this.sessionTitle,
  });

  @override
  State<ChatDetailPage> createState() => _ChatDetailPageState();
}

class _ChatDetailPageState extends State<ChatDetailPage> {
  List<dynamic> messages = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchChatHistory();
  }

  Future<void> fetchChatHistory() async {
    try {
      final response = await http.get(
        Uri.parse(ApiConfig.getChatHistoryUrl(widget.sessionId)),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          messages = data['messages'] as List;
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.sessionTitle),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : messages.isEmpty
              ? const Center(
                  child: Text(
                    'No messages in this chat',
                    style: TextStyle(fontSize: 16),
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final message = messages[index];
                    final isUser = message['sender'] == 'user';
                    final isAdmin = message['sender'] == 'admin';
                    
                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      child: Row(
                        mainAxisAlignment: isUser || isAdmin 
                            ? MainAxisAlignment.end 
                            : MainAxisAlignment.start,
                        children: [
                          if (!isUser && !isAdmin) ...[
                            const CircleAvatar(
                              radius: 16,
                              child: Icon(Icons.smart_toy, size: 16),
                            ),
                            const SizedBox(width: 8),
                          ],
                          Flexible(
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 12,
                              ),
                              decoration: BoxDecoration(
                                color: isUser 
                                    ? Colors.blue
                                    : isAdmin 
                                        ? Colors.orange
                                        : Colors.grey[200],
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (isAdmin)
                                    const Text(
                                      'Admin',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                  Text(
                                    message['text'] ?? 'No message content',
                                    style: TextStyle(
                                      color: isUser || isAdmin 
                                          ? Colors.white 
                                          : Colors.black,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    _formatTimestamp(message['timestamp']),
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: isUser || isAdmin 
                                          ? Colors.white70 
                                          : Colors.grey[600],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          if (isUser || isAdmin) ...[
                            const SizedBox(width: 8),
                            CircleAvatar(
                              radius: 16,
                              backgroundColor: isAdmin ? Colors.orange : Colors.blue,
                              child: Icon(
                                isAdmin ? Icons.admin_panel_settings : Icons.person,
                                size: 16,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ],
                      ),
                    );
                  },
                ),
    );
  }

  String _formatTimestamp(String? timestamp) {
    if (timestamp == null) return 'Unknown time';
    try {
      final dateTime = DateTime.parse(timestamp);
      return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
    } catch (e) {
      return 'Unknown time';
    }
  }
}