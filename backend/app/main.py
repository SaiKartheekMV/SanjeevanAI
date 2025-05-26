from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import uvicorn
import os
from contextlib import asynccontextmanager

# Import API routes
from app.api import router as api_router

# Global variables for app state
app_state = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Diabetes Monitor API...")
    
    # Initialize any global state, database connections, AI models, etc.
    app_state["status"] = "running"
    app_state["version"] = "1.0.0"
    
    # Load AI models here if needed
    try:
        # Example: Load your AI model during startup
        # from app.ai_inference import load_model
        # app_state["ai_model"] = load_model()
        print("✅ AI models initialized")
    except Exception as e:
        print(f"⚠️  Warning: AI model loading failed: {e}")
    
    yield
    
    # Shutdown
    print("🔄 Shutting down Diabetes Monitor API...")
    app_state.clear()

# Create FastAPI app with lifespan management
app = FastAPI(
    title="Diabetes Monitor API",
    description="AI-powered diabetes report analysis and monitoring system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        # Add your production domains here
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "version": app_state.get("version", "unknown"),
        "message": "Diabetes Monitor API is running"
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to Diabetes Monitor API",
        "version": app_state.get("version", "1.0.0"),
        "docs": "/docs",
        "health": "/health",
        "api_prefix": "/api"
    }

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "status_code": exc.status_code
        }
    )

# Global exception handler for unexpected errors
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    print(f"Unexpected error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error",
            "status_code": 500
        }
    )

# Static files (for serving uploaded files, if needed)
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    # Development server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )