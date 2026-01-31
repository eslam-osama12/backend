import pandas as pd
import json

try:
    # Try reading the xlsx file
    xlsx_data = pd.read_excel('products_150.xlsx')
    xlsx_json = xlsx_data.to_json(orient='records')
    xlsx_list = json.loads(xlsx_json)
    
    # Read the json file
    with open('products_150.json', 'r') as f:
        json_list = json.load(f)
    
    print(f"XLSX records: {len(xlsx_list)}")
    print(f"JSON records: {len(json_list)}")
    
    # Compare first record
    if len(xlsx_list) > 0 and len(json_list) > 0:
        print("Comparing first record...")
        print("XLSX:", list(xlsx_list[0].keys()))
        print("JSON:", list(json_list[0].keys()))
        
except Exception as e:
    print(f"Error: {e}")
