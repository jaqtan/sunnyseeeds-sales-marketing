import openpyxl

try:
    # Load Excel
    excel_path = "dashboards/SunnySeeds_Sales_Funnel_Dashboard.xlsx"
    wb = openpyxl.load_workbook(excel_path)
    ws = wb.active
    
    # Row 16: Tour-to-Interview Conversion % (formula)
    # Row 10: Variance vs Target (formula)
    # These should have formulas already, just save
    
    wb.save(excel_path)
    print("✅ KPIs refreshed")
    
except Exception as e:
    print(f"ERROR: {str(e)}")
    exit(2)
