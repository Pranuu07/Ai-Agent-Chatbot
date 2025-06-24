
#!/usr/bin/env python3
"""
Script to check if all required modules can be imported successfully
Run this before starting the main application to verify setup
"""

import sys
import os

def check_import(module_name, package_name=None):
    """Check if a module can be imported"""
    try:
        __import__(module_name)
        print(f"✅ {package_name or module_name} - OK")
        return True
    except ImportError as e:
        print(f"❌ {package_name or module_name} - FAILED: {e}")
        return False

def main():
    print("🔍 Checking Python module imports...")
    print("=" * 50)
    
    # Check standard library modules
    modules_to_check = [
        ("fastapi", "FastAPI"),
        ("uvicorn", "Uvicorn"),
        ("pymongo", "PyMongo"),
        ("dotenv", "python-dotenv"),
        ("requests", "Requests"),
        ("google.generativeai", "Google Generative AI"),
        ("pydantic", "Pydantic"),
        ("PyPDF2", "PyPDF2"),
        ("docx", "python-docx"),
        ("mammoth", "Mammoth"),
        ("bs4", "BeautifulSoup4"),
        ("psutil", "PSUtil"),
    ]
    
    success_count = 0
    total_count = len(modules_to_check)
    
    for module_name, package_name in modules_to_check:
        if check_import(module_name, package_name):
            success_count += 1
    
    print("=" * 50)
    print(f"📊 Results: {success_count}/{total_count} modules imported successfully")
    
    if success_count == total_count:
        print("🎉 All modules are available! You can start the application.")
        return True
    else:
        print("⚠️ Some modules are missing. Please run: pip install -r requirements.txt")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
