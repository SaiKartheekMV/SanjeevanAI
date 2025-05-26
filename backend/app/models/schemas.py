from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional, Dict, List, Any, Union
from datetime import datetime
from enum import Enum

# Enums
class UserType(str, Enum):
    PATIENT = "patient"
    CLINIC = "clinic"
    GOVERNMENT = "government"

class ReportType(str, Enum):
    BLOOD_TEST = "blood_test"
    GLUCOSE_MONITOR = "glucose_monitor"
    GENERAL = "general"
    MEDICATION = "medication"
    DOCTOR_VISIT = "doctor_visit"

class ReportStatus(str, Enum):
    PENDING = "pending"
    ANALYZING = "analyzing"
    ANALYZED = "analyzed"
    ERROR = "error"

class NotificationType(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    SUCCESS = "success"

# User Models
class UserBase(BaseModel):
    name: str
    email: EmailStr
    user_type: UserType

    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return v.strip()

class UserCreate(UserBase):
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    profile: Optional[Dict[str, Any]] = None

class UserResponse(UserBase):
    id: int
    profile: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

# Authentication Models
class Token(BaseModel):
    token: str
    user: UserResponse

class TokenRefresh(BaseModel):
    token: str

# Report Models
class ReportBase(BaseModel):
    title: str
    type: ReportType = ReportType.GENERAL

class ReportCreate(ReportBase):
    pass

class AIAnalysis(BaseModel):
    summary: str
    risk_score: float = Field(..., ge=0, le=10)
    recommendations: List[str] = []
    key_findings: Optional[List[str]] = []
    concerns: Optional[List[str]] = []
    status: str = "completed"
    confidence_score: Optional[float] = Field(None, ge=0, le=1)

class ReportResponse(ReportBase):
    id: int
    user_id: int
    filename: Optional[str] = None
    file_path: Optional[str] = None
    extracted_text: Optional[str] = None
    status: ReportStatus = ReportStatus.PENDING
    ai_analysis: Optional[AIAnalysis] = None
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

class ReportListResponse(BaseModel):
    reports: List[ReportResponse]
    total: int
    page: int
    limit: int
    has_more: bool

# Dashboard Models
class HealthTrends(BaseModel):
    improving: int = 0
    stable: int = 0
    concerning: int = 0

class PatientDashboard(BaseModel):
    total_reports: int
    recent_reports: List[ReportResponse]
    health_trends: HealthTrends
    next_checkup: Optional[str] = None
    user_type: str = "patient"

class ClinicDashboard(BaseModel):
    total_patients: int
    recent_reports: List[ReportResponse]
    pending_reviews: int
    user_type: str = "clinic"

class GovernmentDashboard(BaseModel):
    total_population: int
    health_trends: Dict[str, float]
    user_type: str = "government"

# Union type for dashboard data
DashboardData = Union[PatientDashboard, ClinicDashboard, GovernmentDashboard]

# Health Metrics Models
class HealthMetric(BaseModel):
    range: str
    metrics: Dict[str, Any]
    timeline: List[Dict[str, Any]] = []

class HealthMetricCreate(BaseModel):
    metric_type: str
    value: float = Field(..., ge=0)
    unit: str
    normal_range: Optional[Dict[str, float]] = None
    notes: Optional[str] = None

class HealthMetricResponse(BaseModel):
    id: int
    user_id: int
    metric_type: str
    value: float
    unit: str
    date_recorded: datetime
    normal_range: Optional[Dict[str, float]] = None
    notes: Optional[str] = None
    created_at: str

    class Config:
        from_attributes = True

# Population Data Models
class Demographics(BaseModel):
    age_groups: Dict[str, int]
    regions: Dict[str, int]

class PopulationTrends(BaseModel):
    monthly_new_cases: int
    improvement_rate: float

class PopulationData(BaseModel):
    total_population: int
    diabetes_prevalence: float
    high_risk_count: int
    trends: PopulationTrends
    demographics: Demographics

# Notification Models
class NotificationBase(BaseModel):
    title: str
    message: str
    type: NotificationType = NotificationType.INFO

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    read: bool = False
    created_at: str
    read_at: Optional[str] = None

    class Config:
        from_attributes = True

class NotificationListResponse(BaseModel):
    notifications: List[NotificationResponse]

# Analysis Request Models
class AnalysisRequest(BaseModel):
    text_content: str
    report_type: Optional[ReportType] = ReportType.GENERAL
    patient_info: Optional[Dict[str, Any]] = None

class AnalysisResponse(BaseModel):
    message: str
    analysis: AIAnalysis

class InsightsResponse(BaseModel):
    insights: AIAnalysis
    generated_at: Optional[str] = None

# Translation Models
class TranslationRequest(BaseModel):
    target_language: str
    content: Optional[str] = None

    @validator('target_language')
    def validate_language(cls, v):
        supported_languages = ['es', 'fr', 'de', 'it', 'pt', 'ar', 'zh', 'hi']
        if v.lower() not in supported_languages:
            raise ValueError(f'Language {v} not supported. Supported: {supported_languages}')
        return v.lower()

class TranslationResponse(BaseModel):
    original_language: str = "en"
    target_language: str
    translated_content: str

# Upload Models
class UploadResponse(BaseModel):
    message: str
    report: ReportResponse

class FileInfo(BaseModel):
    filename: str
    file_type: str
    file_size: int

# Patient Management Models (for clinics)
class PatientReportsResponse(BaseModel):
    reports: List[ReportResponse]

# API Response Models
class APIResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class ErrorResponse(BaseModel):
    error: bool = True
    message: str
    status_code: int

class SuccessResponse(BaseModel):
    message: str

# Health Check Models
class HealthCheckResponse(BaseModel):
    status: str = "healthy"
    version: str
    message: str

class RootResponse(BaseModel):
    message: str
    version: str
    docs: str = "/docs"
    health: str = "/health"
    api_prefix: str = "/api"

# Advanced Models for future features
class Appointment(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    appointment_date: datetime
    duration_minutes: int = 30
    location: Optional[str] = None
    patient_id: Optional[int] = None
    clinic_id: Optional[int] = None
    status: str = "scheduled"
    created_at: str
    updated_at: str

class AppointmentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    appointment_date: datetime
    duration_minutes: int = 30
    location: Optional[str] = None
    patient_id: Optional[int] = None
    clinic_id: Optional[int] = None

class AppointmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    appointment_date: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    location: Optional[str] = None
    status: Optional[str] = None

class Medication(BaseModel):
    id: int
    user_id: int
    name: str
    dosage: str
    frequency: str
    instructions: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    active: bool = True
    created_at: str
    updated_at: str

class MedicationCreate(BaseModel):
    name: str
    dosage: str
    frequency: str
    instructions: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None

class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    instructions: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    active: Optional[bool] = None

class Alert(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    severity: str = "medium"  # low, medium, high, critical
    category: str = "general"  # general, medication, appointment, health_metric
    acknowledged: bool = False
    trigger_conditions: Optional[Dict[str, Any]] = None
    created_at: str
    acknowledged_at: Optional[str] = None

class AlertCreate(BaseModel):
    title: str
    message: str
    severity: str = "medium"
    category: str = "general"
    user_id: int
    trigger_conditions: Optional[Dict[str, Any]] = None

class UserSettings(BaseModel):
    notifications_enabled: bool = True
    email_notifications: bool = True
    sms_notifications: bool = False
    language: str = "en"
    timezone: str = "UTC"
    privacy_level: str = "normal"  # minimal, normal, full

class UserSettingsUpdate(BaseModel):
    notifications_enabled: Optional[bool] = None
    email_notifications: Optional[bool] = None
    sms_notifications: Optional[bool] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    privacy_level: Optional[str] = None

# File Upload Models
class FileUpload(BaseModel):
    filename: str
    file_type: str
    file_size: int
    upload_path: str
    
    @validator('file_size')
    def validate_file_size(cls, v):
        max_size = 50 * 1024 * 1024  # 50MB
        if v > max_size:
            raise ValueError(f'File size cannot exceed {max_size} bytes')
        return v

class FileUploadResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    file_size: int
    upload_path: str
    uploaded_by: int
    created_at: str

    class Config:
        from_attributes = True

# Pagination Models
class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    limit: int
    has_more: bool