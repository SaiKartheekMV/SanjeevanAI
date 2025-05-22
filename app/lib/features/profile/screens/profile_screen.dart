import 'package:flutter/material.dart';
import '../controller/profile_controller.dart';
import '../../auth/screens/login_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final ProfileController _profileController = ProfileController();
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _abhaIdController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _profileController.addListener(_updateControllers);
  }

  @override
  void dispose() {
    _profileController.removeListener(_updateControllers);
    _nameController.dispose();
    _phoneController.dispose();
    _abhaIdController.dispose();
    super.dispose();
  }

  void _updateControllers() {
    if (_profileController.user != null) {
      _nameController.text = _profileController.user!.name;
      _phoneController.text = _profileController.user!.phone ?? '';
      _abhaIdController.text = _profileController.user!.abhaId ?? '';
    }
  }

  Future<void> _saveProfile() async {
    if (_formKey.currentState?.validate() ?? false) {
      final success = await _profileController.updateProfile(
        name: _nameController.text.trim(),
        phone: _phoneController.text.trim(),
        abhaId: _abhaIdController.text.trim().isEmpty ? null : _abhaIdController.text.trim(),
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully'),
            backgroundColor: Colors.green,
          ),
        );
      }
    }
  }

  void _logout() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _profileController.logout();
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => const LoginScreen()),
                (route) => false,
              );
            },
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        automaticallyImplyLeading: false,
        actions: [
          AnimatedBuilder(
            animation: _profileController,
            builder: (context, child) {
              if (_profileController.isEditing) {
                return Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextButton(
                      onPressed: _profileController.toggleEditing,
                      child: const Text('Cancel', style: TextStyle(color: Colors.white)),
                    ),
                    TextButton(
                      onPressed: _saveProfile,
                      child: const Text('Save', style: TextStyle(color: Colors.white)),
                    ),
                  ],
                );
              } else {
                return IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: _profileController.toggleEditing,
                );
              }
            },
          ),
        ],
      ),
      body: AnimatedBuilder(
        animation: _profileController,
        builder: (context, child) {
          if (_profileController.isLoading && _profileController.user == null) {
            return const Center(child: CircularProgressIndicator());
          }

          if (_profileController.user == null) {
            return const Center(
              child: Text('Unable to load profile'),
            );
          }

          return RefreshIndicator(
            onRefresh: _profileController.refreshProfile,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    // Profile Picture
                    CircleAvatar(
                      radius: 60,
                      backgroundColor: Colors.blue.shade100,
                      child: _profileController.user!.profileImageUrl != null
                          ? ClipRRect(
                              borderRadius: BorderRadius.circular(60),
                              child: Image.network(
                                _profileController.user!.profileImageUrl!,
                                width: 120,
                                height: 120,
                                fit: BoxFit.cover,
                              ),
                            )
                          : Icon(
                              Icons.person,
                              size: 60,
                              color: Colors.blue.shade300,
                            ),
                    ),
                    const SizedBox(height: 24),

                    // Name Field
                    TextFormField(
                      controller: _nameController,
                      enabled: _profileController.isEditing,
                      decoration: const InputDecoration(
                        labelText: 'Full Name',
                        prefixIcon: Icon(Icons.person),
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your name';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // Email Field (Read-only)
                    TextFormField(
                      initialValue: _profileController.user!.email,
                      enabled: false,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        prefixIcon: Icon(Icons.email),
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Phone Field
                    TextFormField(
                      controller: _phoneController,
                      enabled: _profileController.isEditing,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(
                        labelText: 'Phone Number',
                        prefixIcon: Icon(Icons.phone),
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value != null && value.isNotEmpty) {
                          if (value.length < 10) {
                            return 'Please enter a valid phone number';
                          }
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // ABHA ID Field
                    TextFormField(
                      controller: _abhaIdController,
                      enabled: _profileController.isEditing,
                      decoration: const InputDecoration(
                        labelText: 'ABHA ID (Optional)',
                        prefixIcon: Icon(Icons.credit_card),
                        border: OutlineInputBorder(),
                        helperText: 'Ayushman Bharat Health Account ID',
                      ),
                    ),
                    const SizedBox(height: 16),

                    // User Type (Read-only)
                    TextFormField(
                      initialValue: _profileController.user!.userType.toString().split('.').last.toUpperCase(),
                      enabled: false,
                      decoration: const InputDecoration(
                        labelText: 'User Type',
                        prefixIcon: Icon(Icons.account_circle),
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Created Date (Read-only)
                    TextFormField(
                      initialValue: 'Member since ${_formatDate(_profileController.user!.createdAt)}',
                      enabled: false,
                      decoration: const InputDecoration(
                        labelText: 'Member Since',
                        prefixIcon: Icon(Icons.calendar_today),
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Profile Actions
                    if (!_profileController.isEditing) ...[
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            // Navigate to settings or preferences
                          },
                          icon: const Icon(Icons.settings),
                          label: const Text('Settings'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.grey[600],
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: _logout,
                          icon: const Icon(Icons.logout),
                          label: const Text('Logout'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}