import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("SanjeevanAI")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("Welcome to SanjeevanAI"),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Navigate to upload or analysis screen
              },
              child: const Text("Start Health Check"),
            ),
          ],
        ),
      ),
    );
  }
}
