from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import jwt
import bcrypt
import os
from pathlib import Path

# Import your models and utilities
from app.models.schemas import (
    UserCreate, UserLogin, UserResponse, UserUpdate,
    ReportResponse, ReportCreate, DashboardData,
    PopulationData, NotificationResponse
)
from app.utils.parse_report import parse_uploaded_file
from app.ai_inference import analyze_report_content
from app.database import get_db_connection  # You'll need to implement this

# Create router
router = APIRouter()

# Security
security = HTTPBearer()
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this")
ALGORITHM = "HS256"

# Mock database (replace with real database)
mock_users = {}
mock_reports = {}
mock_notifications = {}

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        user_type = payload.get("user_type")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id, "user_type": user_type}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Authentication endpoints
@router.post("/auth/register")
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        # Check if user exists
        if user_data.email in mock_users:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create user
        user_id = len(mock_users) + 1
        mock_users[user_data.email] = {
            "id": user_id,
            "name": user_data.name,
            "email": user_data.email,
            "password": hashed_password,
            "user_type": user_data.user_type,
            "created_at": datetime.utcnow().isoformat(),
            "profile": {}
        }
        
        return {
            "message": "User registered successfully",
            "user": {
                "id": user_id,
                "name": user_data.name,
                "email": user_data.email,
                "user_type": user_data.user_type
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auth/login")
async def login(credentials: UserLogin):
    """Authenticate user and return token"""
    try:
        # Find user
        user = mock_users.get(credentials.email)
        if not user or not verify_password(credentials.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create token
        token = create_access_token({
            "user_id": user["id"],
            "user_type": user["user_type"],
            "email": user["email"]
        })
        
        return {
            "token": token,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "user_type": user["user_type"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auth/logout")
async def logout(current_user: dict = Depends(verify_token)):
    """Logout user (token-based, so just return success)"""
    return {"message": "Logged out successfully"}

@router.post("/auth/refresh")
async def refresh_token(current_user: dict = Depends(verify_token)):
    """Refresh authentication token"""
    try:
        # Create new token
        token = create_access_token({
            "user_id": current_user["user_id"],
            "user_type": current_user["user_type"]
        })
        return {"token": token}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# User profile endpoints
@router.get("/user/profile")
async def get_profile(current_user: dict = Depends(verify_token)) -> UserResponse:
    """Get current user profile"""
    try:
        # Find user by ID
        user = None
        for email, user_data in mock_users.items():
            if user_data["id"] == current_user["user_id"]:
                user = user_data
                break
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": user["id"],
            "name": user["name"],
            "email": user.get("email", ""),
            "user_type": user["user_type"],
            "profile": user.get("profile", {}),
            "created_at": user.get("created_at")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/user/profile")
async def update_profile(profile_data: UserUpdate, current_user: dict = Depends(verify_token)):
    """Update user profile"""
    try:
        # Find and update user
        for email, user_data in mock_users.items():
            if user_data["id"] == current_user["user_id"]:
                if profile_data.name:
                    user_data["name"] = profile_data.name
                if profile_data.profile:
                    user_data["profile"].update(profile_data.profile)
                break
        
        return {"message": "Profile updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Report management endpoints
@router.get("/reports")
async def get_reports(
    current_user: dict = Depends(verify_token),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    report_type: Optional[str] = None
):
    """Get user reports with pagination"""
    try:
        user_id = current_user["user_id"]
        
        # Filter reports for current user
        user_reports = [
            report for report in mock_reports.values()
            if report.get("user_id") == user_id
        ]
        
        # Filter by type if specified
        if report_type:
            user_reports = [r for r in user_reports if r.get("type") == report_type]
        
        # Sort by date (newest first)
        user_reports.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        
        # Pagination
        start = (page - 1) * limit
        end = start + limit
        paginated_reports = user_reports[start:end]
        
        return {
            "reports": paginated_reports,
            "total": len(user_reports),
            "page": page,
            "limit": limit,
            "has_more": end < len(user_reports)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports/{report_id}")
async def get_report_by_id(report_id: int, current_user: dict = Depends(verify_token)):
    """Get specific report details"""
    try:
        report = mock_reports.get(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Check ownership (patients can only see their own, clinics can see their patients')
        user_type = current_user["user_type"]
        if user_type == "patient" and report.get("user_id") != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="Access denied")
        
        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reports/upload")
async def upload_report(
    file: UploadFile = File(...),
    title: str = Form(...),
    report_type: str = Form("general"),
    current_user: dict = Depends(verify_token)
):
    """Upload and analyze medical report"""
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Check file type
        allowed_types = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        # Create uploads directory
        uploads_dir = Path("uploads")
        uploads_dir.mkdir(exist_ok=True)
        
        # Save file
        file_path = uploads_dir / f"{datetime.utcnow().timestamp()}_{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Parse file content
        try:
            extracted_text = parse_uploaded_file(str(file_path))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")
        
        # AI Analysis
        try:
            ai_analysis = analyze_report_content(extracted_text)
        except Exception as e:
            print(f"AI analysis failed: {e}")
            ai_analysis = {
                "summary": "Analysis unavailable",
                "risk_score": 0,
                "recommendations": [],
                "status": "pending"
            }
        
        # Create report record
        report_id = len(mock_reports) + 1
        report = {
            "id": report_id,
            "user_id": current_user["user_id"],
            "title": title,
            "type": report_type,
            "filename": file.filename,
            "file_path": str(file_path),
            "extracted_text": extracted_text,
            "ai_analysis": ai_analysis,
            "status": "analyzed",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        mock_reports[report_id] = report
        
        return {
            "message": "Report uploaded and analyzed successfully",
            "report": report
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.delete("/reports/{report_id}")
async def delete_report(report_id: int, current_user: dict = Depends(verify_token)):
    """Delete a report"""
    try:
        report = mock_reports.get(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Check ownership
        if report.get("user_id") != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Delete file if exists
        file_path = Path(report.get("file_path", ""))
        if file_path.exists():
            file_path.unlink()
        
        # Delete record
        del mock_reports[report_id]
        
        return {"message": "Report deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# AI Analysis endpoints
@router.post("/reports/{report_id}/analyze")
async def analyze_report(report_id: int, current_user: dict = Depends(verify_token)):
    """Re-analyze a report with AI"""
    try:
        report = mock_reports.get(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Check ownership
        if report.get("user_id") != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Re-analyze
        ai_analysis = analyze_report_content(report.get("extracted_text", ""))
        report["ai_analysis"] = ai_analysis
        report["updated_at"] = datetime.utcnow().isoformat()
        
        return {
            "message": "Report re-analyzed successfully",
            "analysis": ai_analysis
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports/{report_id}/insights")
async def get_insights(report_id: int, current_user: dict = Depends(verify_token)):
    """Get AI insights for a report"""
    try:
        report = mock_reports.get(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return {
            "insights": report.get("ai_analysis", {}),
            "generated_at": report.get("updated_at")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Dashboard endpoints
@router.get("/dashboard")
async def get_dashboard_data(current_user: dict = Depends(verify_token)) -> DashboardData:
    """Get dashboard data for current user"""
    try:
        user_id = current_user["user_id"]
        user_type = current_user["user_type"]
        
        # Get user reports
        user_reports = [r for r in mock_reports.values() if r.get("user_id") == user_id]
        
        if user_type == "patient":
            return {
                "total_reports": len(user_reports),
                "recent_reports": sorted(user_reports, key=lambda x: x.get("created_at", ""))[-5:],
                "health_trends": {"improving": 3, "stable": 2, "concerning": 1},
                "next_checkup": (datetime.now() + timedelta(days=30)).isoformat(),
                "user_type": user_type
            }
        elif user_type == "clinic":
            return {
                "total_patients": 25,
                "recent_reports": user_reports[-10:],
                "pending_reviews": 3,
                "user_type": user_type
            }
        else:  # government
            return {
                "total_population": 10000,
                "health_trends": {"diabetes": 15.2, "hypertension": 23.1},
                "user_type": user_type
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard/metrics")
async def get_health_metrics(
    range: str = Query("30d", regex="^(7d|30d|90d|1y)$"),
    current_user: dict = Depends(verify_token)
):
    """Get health metrics for specified time range"""
    try:
        # Mock metrics data
        return {
            "range": range,
            "metrics": {
                "glucose_avg": 120,
                "glucose_trend": "stable",
                "reports_count": 5,
                "risk_score": 2.3
            },
            "timeline": [
                {"date": "2024-01-01", "glucose": 115, "risk": 2.1},
                {"date": "2024-01-15", "glucose": 125, "risk": 2.5}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Translation endpoints
@router.post("/reports/{report_id}/translate")
async def translate_report(
    report_id: int,
    target_language: str = Form(...),
    current_user: dict = Depends(verify_token)
):
    """Translate report to target language"""
    try:
        report = mock_reports.get(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Mock translation (implement with actual translation service)
        translated_content = f"[Translated to {target_language}] " + report.get("extracted_text", "")
        
        return {
            "original_language": "en",
            "target_language": target_language,
            "translated_content": translated_content
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Clinic endpoints
@router.get("/clinic/patients/{patient_id}/reports")
async def get_patient_reports(
    patient_id: int,
    current_user: dict = Depends(verify_token)
):
    """Get reports for a specific patient (clinic access)"""
    try:
        if current_user["user_type"] != "clinic":
            raise HTTPException(status_code=403, detail="Access denied")
        
        patient_reports = [r for r in mock_reports.values() if r.get("user_id") == patient_id]
        return {"reports": patient_reports}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Government endpoints
@router.get("/government/population")
async def get_population_data(
    current_user: dict = Depends(verify_token),
    age_group: Optional[str] = None,
    region: Optional[str] = None
) -> PopulationData:
    """Get population health data (government access)"""
    try:
        if current_user["user_type"] != "government":
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Mock population data
        return {
            "total_population": 100000,
            "diabetes_prevalence": 8.5,
            "high_risk_count": 8500,
            "trends": {
                "monthly_new_cases": 120,
                "improvement_rate": 15.2
            },
            "demographics": {
                "age_groups": {"18-30": 25, "31-50": 35, "51+": 40},
                "regions": {"north": 30, "south": 35, "east": 35}
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Notifications endpoints
@router.get("/notifications")
async def get_notifications(current_user: dict = Depends(verify_token)):
    """Get user notifications"""
    try:
        user_id = current_user["user_id"]
        user_notifications = [n for n in mock_notifications.values() if n.get("user_id") == user_id]
        return {"notifications": user_notifications}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    current_user: dict = Depends(verify_token)
):
    """Mark notification as read"""
    try:
        notification = mock_notifications.get(notification_id)
        if notification and notification.get("user_id") == current_user["user_id"]:
            notification["read"] = True
            notification["read_at"] = datetime.utcnow().isoformat()
        
        return {"message": "Notification marked as read"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))