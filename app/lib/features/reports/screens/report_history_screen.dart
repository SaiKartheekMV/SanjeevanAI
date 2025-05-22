import 'package:flutter/material.dart';
import '../models/disease_tracking_model.dart';

class ReportHistoryScreen extends StatefulWidget {
  const ReportHistoryScreen({Key? key}) : super(key: key);

  @override
  State<ReportHistoryScreen> createState() => _ReportHistoryScreenState();
}

class _ReportHistoryScreenState extends State<ReportHistoryScreen> {
  List<Report> reports = [
    Report(
      id: '1',
      type: 'X-Ray',
      diseaseType: 'Tuberculosis',
      date: DateTime(2024, 5, 15),
      status: ReportStatus.completed,
      notes: 'Clear chest X-ray, no signs of active TB',
      imagePaths: ['assets/images/xray1.jpg'],
    ),
    Report(
      id: '2',
      type: 'Blood Test',
      diseaseType: 'Hepatitis',
      date: DateTime(2024, 5, 10),
      status: ReportStatus.pending,
      notes: 'Liver function test results pending',
      imagePaths: ['assets/images/blood_test1.jpg'],
    ),
    Report(
      id: '3',
      type: 'CT Scan',
      diseaseType: 'Pneumonia',
      date: DateTime(2024, 5, 5),
      status: ReportStatus.completed,
      notes: 'Mild pneumonia detected in lower right lobe',
      imagePaths: ['assets/images/ct_scan1.jpg', 'assets/images/ct_scan2.jpg'],
    ),
  ];

  String selectedFilter = 'All';

  @override
  Widget build(BuildContext context) {
    List<Report> filteredReports = selectedFilter == 'All' 
        ? reports 
        : reports.where((report) => report.type == selectedFilter).toList();

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text(
          'Report History',
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
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.filter_list, color: Colors.white),
            onSelected: (String value) {
              setState(() {
                selectedFilter = value;
              });
            },
            itemBuilder: (BuildContext context) => [
              const PopupMenuItem(value: 'All', child: Text('All Reports')),
              const PopupMenuItem(value: 'X-Ray', child: Text('X-Ray')),
              const PopupMenuItem(value: 'Blood Test', child: Text('Blood Test')),
              const PopupMenuItem(value: 'CT Scan', child: Text('CT Scan')),
              const PopupMenuItem(value: 'MRI', child: Text('MRI')),
              const PopupMenuItem(value: 'Ultrasound', child: Text('Ultrasound')),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter indicator
          if (selectedFilter != 'All')
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              color: Colors.teal.withOpacity(0.1),
              child: Row(
                children: [
                  Icon(Icons.filter_list, color: Colors.teal[700]),
                  const SizedBox(width: 8),
                  Text(
                    'Showing: $selectedFilter',
                    style: TextStyle(
                      color: Colors.teal[700],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const Spacer(),
                  TextButton(
                    onPressed: () {
                      setState(() {
                        selectedFilter = 'All';
                      });
                    },
                    child: const Text('Clear Filter'),
                  ),
                ],
              ),
            ),
          
          // Reports list
          Expanded(
            child: filteredReports.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredReports.length,
                    itemBuilder: (context, index) {
                      return _buildReportCard(filteredReports[index]);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.assignment_outlined,
            size: 80,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'No reports found',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            selectedFilter == 'All' 
                ? 'Upload your first report to get started'
                : 'No $selectedFilter reports found',
            style: TextStyle(
              color: Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReportCard(Report report) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => _showReportDetails(report),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.teal.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      report.type,
                      style: const TextStyle(
                        color: Colors.teal,
                        fontWeight: FontWeight.w500,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const Spacer(),
                  _buildStatusChip(report.status),
                ],
              ),
              
              const SizedBox(height: 12),
              
              Text(
                report.diseaseType,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
              
              const SizedBox(height: 8),
              
              Row(
                children: [
                  Icon(
                    Icons.calendar_today,
                    size: 16,
                    color: Colors.grey[600],
                  ),
                  const SizedBox(width: 6),
                  Text(
                    '${report.date.day}/${report.date.month}/${report.date.year}',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Icon(
                    Icons.image,
                    size: 16,
                    color: Colors.grey[600],
                  ),
                  const SizedBox(width: 6),
                  Text(
                    '${report.imagePaths.length} image${report.imagePaths.length != 1 ? 's' : ''}',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
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
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusChip(ReportStatus status) {
    Color color;
    String text;
    
    switch (status) {
      case ReportStatus.pending:
        color = Colors.orange;
        text = 'Pending';
        break;
      case ReportStatus.completed:
        color = Colors.green;
        text = 'Completed';
        break;
      case ReportStatus.failed:
        color = Colors.red;
        text = 'Failed';
        break;
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 8,
        vertical: 4,
      ),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w500,
          fontSize: 12,
        ),
      ),
    );
  }

  void _showReportDetails(Report report) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        maxChildSize: 0.9,
        minChildSize: 0.5,
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
                  Text(
                    report.type,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  _buildStatusChip(report.status),
                ],
              ),
              
              const SizedBox(height: 8),
              
              Text(
                report.diseaseType,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[600],
                ),
              ),
              
              const SizedBox(height: 16),
              
              Row(
                children: [
                  Icon(Icons.calendar_today, color: Colors.grey[600]),
                  const SizedBox(width: 8),
                  Text(
                    '${report.date.day}/${report.date.month}/${report.date.year}',
                    style: const TextStyle(fontSize: 16),
                  ),
                ],
              ),
              
              const SizedBox(height: 20),
              
              if (report.notes.isNotEmpty) ...[
                const Text(
                  'Notes:',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  report.notes,
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 20),
              ],
              
              const Text(
                'Images:',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
              
              const SizedBox(height: 12),
              
              Expanded(
                child: GridView.builder(
                  controller: scrollController,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: report.imagePaths.length,
                  itemBuilder: (context, index) => Container(
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.image,
                        size: 50,
                        color: Colors.grey,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}