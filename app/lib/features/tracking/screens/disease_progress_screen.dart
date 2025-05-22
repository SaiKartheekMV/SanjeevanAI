import 'package:flutter/material.dart';
import '../models/disease_tracking_model.dart';

class DiseaseProgressScreen extends StatefulWidget {
  const DiseaseProgressScreen({Key? key}) : super(key: key);

  @override
  State<DiseaseProgressScreen> createState() => _DiseaseProgressScreenState();
}

class _DiseaseProgressScreenState extends State<DiseaseProgressScreen> {
  List<DiseaseProgress> diseaseProgressList = [];

  @override
  void initState() {
    super.initState();
    _loadDiseaseProgress();
  }

  void _loadDiseaseProgress() {
    // Mock data for demonstration
    List<Report> tbReports = [
      Report(
        id: '1',
        type: 'X-Ray',
        diseaseType: 'Tuberculosis',
        date: DateTime(2024, 3, 1),
        status: ReportStatus.completed,
        notes: 'Initial chest X-ray showing lung infiltrates',
        imagePaths: ['path1.jpg'],
      ),
      Report(
        id: '2',
        type: 'Blood Test',
        diseaseType: 'Tuberculosis',
        date: DateTime(2024, 4, 1),
        status: ReportStatus.completed,
        notes: 'TB markers positive, treatment started',
        imagePaths: ['path2.jpg'],
      ),
      Report(
        id: '3',
        type: 'X-Ray',
        diseaseType: 'Tuberculosis',
        date: DateTime(2024, 5, 1),
        status: ReportStatus.pending,
        notes: 'Follow-up X-ray scheduled',
        imagePaths: ['path3.jpg'],
      ),
    ];

    List<Report> hepatitisReports = [
      Report(
        id: '4',
        type: 'Blood Test',
        diseaseType: 'Hepatitis',
        date: DateTime(2024, 4, 15),
        status: ReportStatus.completed,
        notes: 'Hepatitis B surface antigen positive',
        imagePaths: ['path4.jpg'],
      ),
      Report(
        id: '5',
        type: 'Ultrasound',
        diseaseType: 'Hepatitis',
        date: DateTime(2024, 5, 15),
        status: ReportStatus.completed,
        notes: 'Liver ultrasound shows mild inflammation',
        imagePaths: ['path5.jpg'],
      ),
    ];

    setState(() {
      diseaseProgressList = [
        DiseaseProgress.fromReports('Tuberculosis', tbReports),
        DiseaseProgress.fromReports('Hepatitis', hepatitisReports),
      ];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text(
          'Disease Progress',
          style: TextStyle(
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        backgroundColor: Colors.teal,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: diseaseProgressList.isEmpty
          ? _buildEmptyState()
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: diseaseProgressList.length,
              itemBuilder: (context, index) {
                return _buildDiseaseProgressCard(diseaseProgressList[index]);
              },
            ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.trending_up,
            size: 80,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'No progress data yet',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Upload reports to track your progress',
            style: TextStyle(
              color: Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDiseaseProgressCard(DiseaseProgress progress) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => _showProgressDetails(progress),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      progress.diseaseType,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.teal,
                      ),
                    ),
                  ),
                  _buildStatusIcon(progress.overallStatus),
                ],
              ),
              
              const SizedBox(height: 16),
              
              // Progress bar
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Progress',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                          color: Colors.grey,
                        ),
                      ),
                      Text(
                        '${progress.progressPercentage.toInt()}%',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.teal,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  LinearProgressIndicator(
                    value: progress.progressPercentage / 100,
                    backgroundColor: Colors.grey[300],
                    valueColor: AlwaysStoppedAnimation<Color>(
                      _getProgressColor(progress.progressPercentage),
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 16),
              
              // Statistics
              Row(
                children: [
                  Expanded(
                    child: _buildStatItem(
                      'Reports',
                      progress.reports.length.toString(),
                      Icons.assignment,
                    ),
                  ),
                  Expanded(
                    child: _buildStatItem(
                      'Duration',
                      _calculateDuration(progress.firstReportDate, progress.lastReportDate),
                      Icons.schedule,
                    ),
                  ),
                  Expanded(
                    child: _buildStatItem(
                      'Last Update',
                      _formatDate(progress.lastReportDate),
                      Icons.update,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(
          icon,
          color: Colors.teal,
          size: 20,
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildStatusIcon(ReportStatus status) {
    IconData icon;
    Color color;
    
    switch (status) {
      case ReportStatus.completed:
        icon = Icons.check_circle;
        color = Colors.green;
        break;
      case ReportStatus.pending:
        icon = Icons.schedule;
        color = Colors.orange;
        break;
      case ReportStatus.failed:
        icon = Icons.error;
        color = Colors.red;
        break;
    }
    
    return Icon(icon, color: color, size: 28);
  }

  Color _getProgressColor(double progress) {
    if (progress >= 80) return Colors.green;
    if (progress >= 50) return Colors.orange;
    return Colors.red;
  }

  String _calculateDuration(DateTime start, DateTime end) {
    final difference = end.difference(start).inDays;
    if (difference < 30) {
      return '${difference}d';
    } else {
      final months = (difference / 30).floor();
      return '${months}m';
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date).inDays;
    
    if (difference == 0) return 'Today';
    if (difference == 1) return 'Yesterday';
    if (difference < 7) return '${difference}d ago';
    if (difference < 30) return '${(difference / 7).floor()}w ago';
    return '${date.day}/${date.month}';
  }

  void _showProgressDetails(DiseaseProgress progress) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.8,
        maxChildSize: 0.95,
        minChildSize: 0.6,
        builder: (context, scrollController) => Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              
              const SizedBox(height: 20),
              
              Row(
                children: [
                  Expanded(
                    child: Text(
                      '${progress.diseaseType} Progress',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  _buildStatusIcon(progress.overallStatus),
                ],
              ),
              
              const SizedBox(height: 20),
              
              // Timeline
              const Text(
                'Report Timeline',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
              
              const SizedBox(height: 16),
              
              Expanded(
                child: ListView.builder(
                  controller: scrollController,
                  itemCount: progress.reports.length,
                  itemBuilder: (context, index) {
                    final report = progress.reports[index];
                    final isLast = index == progress.reports.length - 1;
                    
                    return Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Column(
                          children: [
                            Container(
                              width: 12,
                              height: 12,
                              decoration: BoxDecoration(
                                color: _getStatusColor(report.status),
                                shape: BoxShape.circle,
                              ),
                            ),
                            if (!isLast)
                              Container(
                                width: 2,
                                height: 60,
                                color: Colors.grey[300],
                              ),
                          ],
                        ),
                        
                        const SizedBox(width: 16),
                        
                        Expanded(
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 16),
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.grey[50],
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.grey[200]!),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      report.type,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    const Spacer(),
                                    Text(
                                      _formatDate(report.date),
                                      style: TextStyle(
                                        color: Colors.grey[600],
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                                if (report.notes.isNotEmpty) ...[
                                  const SizedBox(height: 8),
                                  Text(
                                    report.notes,
                                    style: TextStyle(
                                      color: Colors.grey[700],
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getStatusColor(ReportStatus status) {
    switch (status) {
      case ReportStatus.completed:
        return Colors.green;
      case ReportStatus.pending:
        return Colors.orange;
      case ReportStatus.failed:
        return Colors.red;
    }
  }
}