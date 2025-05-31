# app/ai_inference.py
import re
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import openai  # type: ignore # Optional: if using OpenAI API
import os

logger = logging.getLogger(__name__)

# Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

def analyze_report_content(text_content: str, report_type: str = "general") -> Dict[str, Any]:
    """
    Analyze medical report content and provide AI insights
    This is a comprehensive function that can use multiple approaches
    """
    try:
        if not text_content or not text_content.strip():
            return create_empty_analysis("No content to analyze")
        
        # Try different analysis methods in order of preference
        if OPENAI_API_KEY:
            try:
                return analyze_with_openai(text_content, report_type)
            except Exception as e:
                logger.warning(f"OpenAI analysis failed: {e}")
        
        # Fallback to rule-based analysis
        return analyze_with_rules(text_content, report_type)
        
    except Exception as e:
        logger.error(f"Error in AI analysis: {str(e)}")
        return create_error_analysis(str(e))

def analyze_with_openai(text_content: str, report_type: str) -> Dict[str, Any]:
    """
    Analyze report using OpenAI API
    """
    try:
        prompt = create_analysis_prompt(text_content, report_type)
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a medical AI assistant specialized in analyzing diabetes-related reports and providing insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.3
        )
        
        analysis_text = response.choices[0].message.content
        return parse_ai_response(analysis_text)
        
    except Exception as e:
        logger.error(f"OpenAI API error: {str(e)}")
        raise

def analyze_with_rules(text_content: str, report_type: str) -> Dict[str, Any]:
    """
    Rule-based analysis for medical reports
    This provides a fallback when AI services are unavailable
    """
    try:
        analysis = {
            "summary": "",
            "risk_score": 0.0,
            "recommendations": [],
            "key_findings": [],
            "concerns": [],
            "status": "completed",
            "confidence_score": 0.7
        }
        
        text_lower = text_content.lower()
        
        # Extract key metrics
        glucose_values = extract_glucose_values(text_content)
        blood_pressure = extract_blood_pressure(text_content)
        hba1c_values = extract_hba1c_values(text_content)
        
        # Analyze glucose levels
        glucose_analysis = analyze_glucose_levels(glucose_values)
        
        # Analyze HbA1c levels
        hba1c_analysis = analyze_hba1c_levels(hba1c_values)
        
        # Calculate risk score
        risk_score = calculate_risk_score(glucose_values, hba1c_values, blood_pressure, text_lower)
        
        # Generate summary
        summary_parts = []
        if glucose_values:
            summary_parts.append(f"Glucose readings: {len(glucose_values)} measurements found")
        if hba1c_values:
            summary_parts.append(f"HbA1c levels: {hba1c_values}")
        if blood_pressure:
            summary_parts.append(f"Blood pressure: {blood_pressure}")
        
        analysis["summary"] = ". ".join(summary_parts) if summary_parts else "Medical report analyzed"
        analysis["risk_score"] = risk_score
        analysis["key_findings"] = extract_key_findings(text_content, glucose_values, hba1c_values)
        analysis["recommendations"] = generate_recommendations(risk_score, glucose_values, hba1c_values)
        analysis["concerns"] = identify_concerns(text_content, risk_score)
        
        return analysis
        
    except Exception as e:
        logger.error(f"Error in rules-based analysis: {str(e)}")
        return create_error_analysis(str(e))

def extract_glucose_values(text: str) -> List[float]:
    """Extract glucose values from text"""
    glucose_pattern = r'glucose[:\s]*(\d+(?:\.\d+)?)\s*(?:mg/dl|mmol/l)?'
    blood_sugar_pattern = r'blood\s+sugar[:\s]*(\d+(?:\.\d+)?)\s*(?:mg/dl|mmol/l)?'
    
    values = []
    
    # Find glucose mentions
    for pattern in [glucose_pattern, blood_sugar_pattern]:
        matches = re.findall(pattern, text.lower())
        for match in matches:
            try:
                value = float(match)
                if 50 <= value <= 500:  # Reasonable glucose range
                    values.append(value)
            except ValueError:
                continue
    
    return list(set(values))  # Remove duplicates

def extract_hba1c_values(text: str) -> List[float]:
    """Extract HbA1c values from text"""
    hba1c_pattern = r'hba1c[:\s]*(\d+(?:\.\d+)?)\s*%?'
    a1c_pattern = r'a1c[:\s]*(\d+(?:\.\d+)?)\s*%?'
    
    values = []
    
    for pattern in [hba1c_pattern, a1c_pattern]:
        matches = re.findall(pattern, text.lower())
        for match in matches:
            try:
                value = float(match)
                if 4.0 <= value <= 15.0:  # Reasonable HbA1c range
                    values.append(value)
            except ValueError:
                continue
    
    return list(set(values))

def extract_blood_pressure(text: str) -> Optional[tuple]:
    """Extract blood pressure readings"""
    bp_pattern = r'(\d{2,3})/(\d{2,3})\s*(?:mmhg)?'
    
    matches = re.findall(bp_pattern, text.lower())
    for match in matches:
        try:
            systolic = int(match[0])
            diastolic = int(match[1])
            if 80 <= systolic <= 250 and 40 <= diastolic <= 150:
                return (systolic, diastolic)
        except ValueError:
            continue
    
    return None

def analyze_glucose_levels(glucose_values: List[float]) -> Dict[str, Any]:
    """Analyze glucose level patterns"""
    if not glucose_values:
        return {"status": "no_data"}
    
    avg_glucose = sum(glucose_values) / len(glucose_values)
    high_readings = [v for v in glucose_values if v > 180]
    low_readings = [v for v in glucose_values if v < 70]
    
    return {
        "average": avg_glucose,
        "high_count": len(high_readings),
        "low_count": len(low_readings),
        "total_readings": len(glucose_values)
    }

def analyze_hba1c_levels(hba1c_values: List[float]) -> Dict[str, Any]:
    """Analyze HbA1c levels"""
    if not hba1c_values:
        return {"status": "no_data"}
    
    latest_hba1c = hba1c_values[-1]  # Assume last is most recent
    
    if latest_hba1c < 7.0:
        control_status = "good"
    elif latest_hba1c < 8.0:
        control_status = "moderate"
    else:
        control_status = "poor"
    
    return {
        "latest_value": latest_hba1c,
        "control_status": control_status,
        "values": hba1c_values
    }

def calculate_risk_score(glucose_values: List[float], hba1c_values: List[float], 
                        blood_pressure: Optional[tuple], text_lower: str) -> float:
    """Calculate overall diabetes risk score (0-10)"""
    risk_score = 0.0
    
    # Glucose-based risk
    if glucose_values:
        avg_glucose = sum(glucose_values) / len(glucose_values)
        if avg_glucose > 200:
            risk_score += 3.0
        elif avg_glucose > 140:
            risk_score += 2.0
        elif avg_glucose < 70:
            risk_score += 1.5
    
    # HbA1c-based risk
    if hba1c_values:
        latest_hba1c = max(hba1c_values)
        if latest_hba1c > 9.0:
            risk_score += 3.0
        elif latest_hba1c > 7.0:
            risk_score += 1.5
    
    # Blood pressure risk
    if blood_pressure:
        systolic, diastolic = blood_pressure
        if systolic > 140 or diastolic > 90:
            risk_score += 1.0
    
    # Text-based risk factors
    risk_keywords = [
        'complications', 'neuropathy', 'retinopathy', 'nephropathy',
        'ketones', 'ketoacidosis', 'hypoglycemia', 'hyperglycemia'
    ]
    
    for keyword in risk_keywords:
        if keyword in text_lower:
            risk_score += 0.5
    
    return min(risk_score, 10.0)  # Cap at 10

def extract_key_findings(text: str, glucose_values: List[float], hba1c_values: List[float]) -> List[str]:
    """Extract key medical findings"""
    findings = []
    
    if glucose_values:
        avg_glucose = sum(glucose_values) / len(glucose_values)
        findings.append(f"Average glucose level: {avg_glucose:.1f} mg/dL")
        
        high_readings = [v for v in glucose_values if v > 180]
        if high_readings:
            findings.append(f"{len(high_readings)} elevated glucose readings detected")
    
    if hba1c_values:
        latest_hba1c = hba1c_values[-1]
        findings.append(f"HbA1c level: {latest_hba1c}%")
    
    # Look for specific medical terms
    medical_terms = {
        'medication': r'(metformin|insulin|glipizide|glyburide)',
        'complications': r'(neuropathy|retinopathy|nephropathy)',
        'symptoms': r'(polyuria|polydipsia|polyphagia|fatigue)'
    }
    
    text_lower = text.lower()
    for category, pattern in medical_terms.items():
        matches = re.findall(pattern, text_lower)
        if matches:
            findings.append(f"{category.title()}: {', '.join(set(matches))}")
    
    return findings[:5]  # Limit to 5 key findings

def generate_recommendations(risk_score: float, glucose_values: List[float], 
                           hba1c_values: List[float]) -> List[str]:
    """Generate personalized recommendations"""
    recommendations = []
    
    if risk_score > 5:
        recommendations.append("Schedule an immediate consultation with your healthcare provider")
        recommendations.append("Consider more frequent glucose monitoring")
    
    if glucose_values:
        avg_glucose = sum(glucose_values) / len(glucose_values)
        high_readings = [v for v in glucose_values if v > 180]
        
        if avg_glucose > 180:
            recommendations.append("Review your medication dosage with your doctor")
            recommendations.append("Focus on dietary modifications to reduce post-meal spikes")
        elif avg_glucose > 140:
            recommendations.append("Monitor carbohydrate intake more closely")
            recommendations.append("Consider increasing physical activity")
        
        if high_readings and len(high_readings) > len(glucose_values) * 0.3:
            recommendations.append("Identify and avoid triggers for high glucose readings")
    
    if hba1c_values:
        latest_hba1c = hba1c_values[-1]
        if latest_hba1c > 8.0:
            recommendations.append("Your diabetes management plan needs immediate adjustment")
            recommendations.append("Discuss intensifying treatment with your healthcare team")
        elif latest_hba1c > 7.0:
            recommendations.append("Work on improving glucose control to reach target HbA1c")
    
    # General recommendations
    if not recommendations or len(recommendations) < 3:
        recommendations.extend([
            "Maintain regular blood glucose monitoring",
            "Follow a balanced, diabetes-friendly diet",
            "Engage in regular physical exercise as approved by your doctor",
            "Take medications as prescribed",
            "Keep regular appointments with your healthcare team"
        ])
    
    return recommendations[:6]  # Limit to 6 recommendations

def identify_concerns(text: str, risk_score: float) -> List[str]:
    """Identify potential health concerns"""
    concerns = []
    text_lower = text.lower()
    
    # High-risk indicators
    if risk_score > 7:
        concerns.append("High risk score indicates need for immediate medical attention")
    
    # Specific concern keywords
    concern_patterns = {
        "Diabetic complications": r'(neuropathy|retinopathy|nephropathy|foot ulcer)',
        "Severe hypoglycemia": r'(severe.*hypoglycemia|unconscious|seizure)',
        "Ketoacidosis risk": r'(ketones|ketoacidosis|dka)',
        "Cardiovascular risk": r'(chest pain|heart|cardiac|stroke)',
        "Infection risk": r'(infection|wound|slow healing)'
    }
    
    for concern_type, pattern in concern_patterns.items():
        if re.search(pattern, text_lower):
            concerns.append(concern_type)
    
    # Medication concerns
    if re.search(r'(missed.*medication|forgot.*insulin|ran out)', text_lower):
        concerns.append("Medication adherence issues")
    
    return concerns[:4]  # Limit to 4 main concerns

def create_analysis_prompt(text_content: str, report_type: str) -> str:
    """Create a structured prompt for AI analysis"""
    prompt = f"""
    Please analyze the following medical report and provide insights:

    Report Type: {report_type}
    Content: {text_content}

    Please provide analysis in the following JSON format:
    {{
        "summary": "Brief summary of the report",
        "risk_score": 0.0,  // Scale of 0-10
        "recommendations": ["recommendation1", "recommendation2"],
        "key_findings": ["finding1", "finding2"],
        "concerns": ["concern1", "concern2"],
        "status": "completed",
        "confidence_score": 0.8  // Scale of 0-1
    }}

    Focus on:
    1. Glucose levels and trends
    2. HbA1c values and diabetes control
    3. Risk factors and complications
    4. Medication adherence
    5. Lifestyle factors
    """
    return prompt

def parse_ai_response(response_text: str) -> Dict[str, Any]:
    """Parse AI response and extract structured data"""
    try:
        # Try to extract JSON from the response
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            # Fallback to manual parsing
            return parse_text_response(response_text)
    except json.JSONDecodeError:
        return parse_text_response(response_text)

def parse_text_response(response_text: str) -> Dict[str, Any]:
    """Parse plain text AI response"""
    analysis = {
        "summary": "",
        "risk_score": 0.0,
        "recommendations": [],
        "key_findings": [],
        "concerns": [],
        "status": "completed",
        "confidence_score": 0.6
    }
    
    # Extract summary (first paragraph)
    lines = response_text.split('\n')
    summary_lines = []
    for line in lines[:3]:
        if line.strip():
            summary_lines.append(line.strip())
    analysis["summary"] = ". ".join(summary_lines)
    
    # Extract recommendations (look for bullet points or numbered lists)
    rec_pattern = r'(?:recommend|suggest|advise).*?(?:\n|$)'
    recommendations = re.findall(rec_pattern, response_text, re.IGNORECASE)
    analysis["recommendations"] = [rec.strip() for rec in recommendations[:5]]
    
    # Simple risk score estimation based on keywords
    risk_keywords = ['high', 'elevated', 'concerning', 'urgent', 'critical']
    risk_count = sum(1 for keyword in risk_keywords if keyword in response_text.lower())
    analysis["risk_score"] = min(risk_count * 2, 10)
    
    return analysis

def create_empty_analysis(message: str) -> Dict[str, Any]:
    """Create empty analysis structure"""
    return {
        "summary": message,
        "risk_score": 0.0,
        "recommendations": ["Please upload a valid report for analysis"],
        "key_findings": [],
        "concerns": [],
        "status": "no_content",
        "confidence_score": 0.0
    }

def create_error_analysis(error_message: str) -> Dict[str, Any]:
    """Create error analysis structure"""
    return {
        "summary": f"Analysis failed: {error_message}",
        "risk_score": 0.0,
        "recommendations": ["Please try uploading the report again"],
        "key_findings": [],
        "concerns": ["Technical error in analysis"],
        "status": "error",
        "confidence_score": 0.0
    }

# Additional utility functions for enhanced analysis

def detect_medication_mentions(text: str) -> List[Dict[str, str]]:
    """Detect medication mentions in text"""
    medications = []
    
    # Common diabetes medications
    med_patterns = {
        'Metformin': r'metformin',
        'Insulin': r'insulin|novolog|humalog|lantus|levemir',
        'Sulfonylureas': r'glipizide|glyburide|glimepiride',
        'DPP-4 inhibitors': r'sitagliptin|saxagliptin|linagliptin',
        'GLP-1 agonists': r'exenatide|liraglutide|dulaglutide',
        'SGLT2 inhibitors': r'dapagliflozin|empagliflozin|canagliflozin'
    }
    
    text_lower = text.lower()
    for med_class, pattern in med_patterns.items():
        matches = re.findall(pattern, text_lower)
        if matches:
            medications.append({
                "class": med_class,
                "mentioned": list(set(matches))
            })
    
    return medications

def calculate_glucose_variability(glucose_values: List[float]) -> Dict[str, float]:
    """Calculate glucose variability metrics"""
    if len(glucose_values) < 2:
        return {"status": "insufficient_data"} # type: ignore
    
    # Calculate standard deviation
    mean_glucose = sum(glucose_values) / len(glucose_values)
    variance = sum((x - mean_glucose) ** 2 for x in glucose_values) / len(glucose_values)
    std_dev = variance ** 0.5
    
    # Calculate coefficient of variation
    cv = (std_dev / mean_glucose) * 100 if mean_glucose > 0 else 0
    
    return {
        "standard_deviation": round(std_dev, 2),
        "coefficient_of_variation": round(cv, 2),
        "mean": round(mean_glucose, 2),
        "min": min(glucose_values),
        "max": max(glucose_values)
    }

def assess_time_in_range(glucose_values: List[float]) -> Dict[str, Any]:
    """Assess time in target glucose range"""
    if not glucose_values:
        return {"status": "no_data"}
    
    target_range = (70, 180)  # mg/dL
    in_range = [v for v in glucose_values if target_range[0] <= v <= target_range[1]]
    below_range = [v for v in glucose_values if v < target_range[0]]
    above_range = [v for v in glucose_values if v > target_range[1]]
    
    total = len(glucose_values)
    
    return {
        "time_in_range_percent": round((len(in_range) / total) * 100, 1),
        "time_below_range_percent": round((len(below_range) / total) * 100, 1),
        "time_above_range_percent": round((len(above_range) / total) * 100, 1),
        "target_range": target_range,
        "total_readings": total
    }

def generate_trend_analysis(values: List[float], timestamps: Optional[List[str]] = None) -> Dict[str, Any]:
    """Generate trend analysis for glucose or other values"""
    if len(values) < 3:
        return {"status": "insufficient_data"}
    
    # Simple trend calculation (slope of linear regression)
    n = len(values)
    x_values = list(range(n))
    
    # Calculate slope
    sum_x = sum(x_values)
    sum_y = sum(values)
    sum_xy = sum(x * y for x, y in zip(x_values, values))
    sum_x2 = sum(x * x for x in x_values)
    
    slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x)
    
    # Determine trend direction
    if slope > 1:
        trend = "increasing"
    elif slope < -1:
        trend = "decreasing"
    else:
        trend = "stable"
    
    return {
        "trend_direction": trend,
        "slope": round(slope, 3),
        "recent_average": round(sum(values[-3:]) / 3, 1),
        "overall_average": round(sum(values) / len(values), 1)
    }