import os
import sys
import re
import urllib.request
import json
import http.server
import socketserver
import threading
import time

if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

PROJECT_DIR = r"C:\Users\yiannis\.gemini\antigravity\scratch\weather-tracker"

def test_files_exist():
    print("[1] Testing files exist...")
    required_files = ["index.html", "style.css", "app.js"]
    for f in required_files:
        path = os.path.join(PROJECT_DIR, f)
        assert os.path.exists(path), f"Missing file: {f}"
        size = os.path.getsize(path)
        assert size > 200, f"File {f} is suspiciously small ({size} bytes)"
        print(f"  [OK] {f} exists ({size:,} bytes)")
    print("  [OK] All required files present.\n")

def test_dom_ids_matching():
    print("[2] Testing DOM IDs matching between HTML and JS...")
    with open(os.path.join(PROJECT_DIR, "index.html"), "r", encoding="utf-8") as f:
        html_content = f.read()
    with open(os.path.join(PROJECT_DIR, "app.js"), "r", encoding="utf-8") as f:
        js_content = f.read()

    # Find all document.getElementById in app.js
    js_ids = re.findall(r"getElementById\(['\"]([a-zA-Z0-9_-]+)['\"]\)", js_content)
    assert len(js_ids) > 0, "No getElementById found in app.js"

    missing_in_html = []
    for elem_id in js_ids:
        if f'id="{elem_id}"' not in html_content and f"id='{elem_id}'" not in html_content:
            missing_in_html.append(elem_id)

    assert not missing_in_html, f"IDs present in app.js but missing in index.html: {missing_in_html}"
    print(f"  [OK] All {len(js_ids)} DOM elements referenced in app.js match index.html elements: {js_ids}\n")

def test_live_api():
    print("[3] Testing live API endpoints used by the tracker...")
    # Test geocoding
    city = "Athens"
    geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=el&format=json"
    req = urllib.request.Request(geo_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        assert resp.status == 200, f"Geocoding failed with status {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
        assert "results" in data and len(data["results"]) > 0, "No results from geocoding"
        lat = data["results"][0]["latitude"]
        lon = data["results"][0]["longitude"]
        print(f"  [OK] Geocoding successful for {city}: lat={lat}, lon={lon}")

    # Test forecast
    forecast_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure&hourly=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto"
    req2 = urllib.request.Request(forecast_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req2, timeout=10) as resp2:
        assert resp2.status == 200, f"Forecast failed with status {resp2.status}"
        forecast_data = json.loads(resp2.read().decode('utf-8'))
        
        # Verify required keys in current
        current = forecast_data.get("current", {})
        expected_current = ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "weather_code", "wind_speed_10m", "surface_pressure"]
        for field in expected_current:
            assert field in current, f"Missing field in current: {field}"
        print(f"  [OK] Current weather received: Temp={current['temperature_2m']}C, Humidity={current['relative_humidity_2m']}%, Wind={current['wind_speed_10m']}km/h")

        # Verify hourly
        hourly = forecast_data.get("hourly", {})
        assert "time" in hourly and len(hourly["time"]) >= 24, "Missing or insufficient hourly times"
        assert "temperature_2m" in hourly and len(hourly["temperature_2m"]) >= 24, "Missing hourly temperatures"
        print(f"  [OK] Hourly forecast received ({len(hourly['time'])} hours)")

        # Verify daily
        daily = forecast_data.get("daily", {})
        assert "time" in daily and len(daily["time"]) >= 7, "Missing or insufficient daily times"
        assert "temperature_2m_max" in daily, "Missing daily max temps"
        print(f"  [OK] 7-Day daily forecast received ({len(daily['time'])} days)\n")

def test_local_http_serving():
    print("[4] Testing local HTTP server serving the assets...")
    port = 8765
    
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=PROJECT_DIR, **kwargs)
        def log_message(self, format, *args):
            pass # Suppress log output during test

    server = socketserver.TCPServer(("127.0.0.1", port), Handler)
    server_thread = threading.Thread(target=server.serve_forever)
    server_thread.daemon = True
    server_thread.start()
    time.sleep(0.5)

    try:
        endpoints = ["/", "/index.html", "/style.css", "/app.js"]
        for ep in endpoints:
            url = f"http://127.0.0.1:{port}{ep}"
            with urllib.request.urlopen(url, timeout=5) as res:
                assert res.status == 200, f"Failed GET {url} with status {res.status}"
                content = res.read()
                assert len(content) > 0, f"Empty response for {url}"
                print(f"  [OK] HTTP GET {ep} -> Status 200 OK ({len(content):,} bytes)")
    finally:
        server.shutdown()
        server.server_close()
    print("  [OK] Local web server test completed successfully.\n")

if __name__ == "__main__":
    try:
        test_files_exist()
        test_dom_ids_matching()
        test_live_api()
        test_local_http_serving()
        print("[SUCCESS] ALL TESTS PASSED! The weather tracker is fully functional.")
    except Exception as e:
        print(f"[FAIL] Test failed: {e}", file=sys.stderr)
        sys.exit(1)
