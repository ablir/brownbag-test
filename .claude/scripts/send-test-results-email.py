#!/usr/bin/env python3
"""
Send comprehensive test results via email.
Includes Vitest, Selenium, and Playwright results with coverage reporting.
Highlights only failing test scenarios.
"""

import os
import smtplib
import sys
import json
import re
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime
from pathlib import Path
import glob

def parse_vitest_output(output_file):
    """Parse Vitest output to extract test results and failures."""
    try:
        with open(output_file, 'r') as f:
            content = f.read()

        # Remove ANSI color codes for easier parsing
        ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
        clean_content = ansi_escape.sub('', content)

        # Extract test counts from summary line like: "Tests  10 failed | 9 passed (19)"
        passed = 0
        failed = 0

        # Look for the test summary line
        test_summary = re.search(r'Tests\s+(?:(\d+)\s+failed\s*\|?\s*)?(?:(\d+)\s+passed)?\s*\((\d+)\)', clean_content)
        if test_summary:
            failed = int(test_summary.group(1)) if test_summary.group(1) else 0
            passed = int(test_summary.group(2)) if test_summary.group(2) else 0
            total = int(test_summary.group(3))
        else:
            # Fallback: count checkmarks and x marks
            passed = len(re.findall(r'✓', clean_content))
            failed = len(re.findall(r'×', clean_content))
            total = passed + failed

        # Extract failure details
        failures = []
        failed_tests = re.findall(r'×\s+(.+?)(?=\n)', clean_content)
        for test in failed_tests[:10]:  # Limit to 10
            failures.append(f'✗ {test.strip()}')

        return {
            'total': total if test_summary else passed + failed,
            'passed': passed,
            'failed': failed,
            'failures': failures,
            'raw_output': content
        }
    except Exception as e:
        return {
            'total': 0,
            'passed': 0,
            'failed': 0,
            'failures': [f'Error parsing Vitest output: {str(e)}'],
            'raw_output': ''
        }

def parse_selenium_output(output_file):
    """Parse Selenium/Jest output to extract test results."""
    try:
        with open(output_file, 'r') as f:
            content = f.read()

        # Extract test summary from line like: "Tests:       26 passed, 26 total"
        # or "Tests:       2 failed, 24 passed, 26 total"
        passed = 0
        failed = 0

        test_line = re.search(r'Tests:\s+(?:(\d+)\s+failed,\s*)?(\d+)\s+passed,\s*(\d+)\s+total', content)
        if test_line:
            failed = int(test_line.group(1)) if test_line.group(1) else 0
            passed = int(test_line.group(2))
            total = int(test_line.group(3))
        else:
            # Fallback: look for simpler pattern
            passed_match = re.search(r'(\d+) passed', content)
            failed_match = re.search(r'(\d+) failed', content)
            passed = int(passed_match.group(1)) if passed_match else 0
            failed = int(failed_match.group(1)) if failed_match else 0
            total = passed + failed

        # Extract failure details
        failures = []
        failure_blocks = re.findall(r'●.*?(?=\n\n|\n●|$)', content, re.DOTALL)
        for block in failure_blocks[:10]:  # Limit to first 10 failures
            failures.append(block.strip())

        return {
            'total': total,
            'passed': passed,
            'failed': failed,
            'failures': failures,
            'raw_output': content
        }
    except Exception as e:
        return {
            'total': 0,
            'passed': 0,
            'failed': 0,
            'failures': [f'Error parsing Selenium output: {str(e)}'],
            'raw_output': ''
        }

def parse_playwright_output(output_file):
    """Parse Playwright output to extract test results."""
    try:
        with open(output_file, 'r') as f:
            content = f.read()

        # Simple parsing for Playwright output
        failures = []
        if 'error' in content.lower() or 'failed' in content.lower():
            failures.append('Playwright test encountered errors')

        # Consider it passed if no obvious errors
        failed = len(failures)
        passed = 1 if failed == 0 else 0

        return {
            'total': passed + failed,
            'passed': passed,
            'failed': failed,
            'failures': failures,
            'raw_output': content
        }
    except Exception as e:
        return {
            'total': 0,
            'passed': 0,
            'failed': 0,
            'failures': [f'Error parsing Playwright output: {str(e)}'],
            'raw_output': ''
        }

def parse_coverage(coverage_file):
    """Parse coverage summary JSON."""
    try:
        if not os.path.exists(coverage_file):
            return None

        with open(coverage_file, 'r') as f:
            coverage_data = json.load(f)

        # Extract total coverage percentages
        total = coverage_data.get('total', {})

        return {
            'lines': total.get('lines', {}).get('pct', 0),
            'statements': total.get('statements', {}).get('pct', 0),
            'functions': total.get('functions', {}).get('pct', 0),
            'branches': total.get('branches', {}).get('pct', 0),
        }
    except Exception as e:
        print(f"Warning: Could not parse coverage: {str(e)}")
        return None

def generate_html_email(vitest_results, selenium_results, playwright_results, coverage):
    """Generate HTML email body with test results."""

    # Calculate overall status
    total_failed = vitest_results['failed'] + selenium_results['failed'] + playwright_results['failed']
    total_passed = vitest_results['passed'] + selenium_results['passed'] + playwright_results['passed']
    total_tests = total_passed + total_failed

    overall_status = "✅ ALL TESTS PASSED" if total_failed == 0 else f"❌ {total_failed} TESTS FAILED"
    status_color = "#4CAF50" if total_failed == 0 else "#F44336"

    html = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .header {{ background-color: {status_color}; color: white; padding: 20px; text-align: center; }}
            .summary {{ background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }}
            .test-section {{ margin: 20px 0; padding: 15px; border-left: 4px solid #2196F3; background-color: #f9f9f9; }}
            .test-section h3 {{ margin-top: 0; color: #2196F3; }}
            .passed {{ color: #4CAF50; font-weight: bold; }}
            .failed {{ color: #F44336; font-weight: bold; }}
            .failure-box {{ background-color: #ffebee; padding: 10px; margin: 10px 0; border-left: 3px solid #F44336; font-family: monospace; font-size: 12px; }}
            .coverage-table {{ width: 100%; border-collapse: collapse; margin: 10px 0; }}
            .coverage-table th, .coverage-table td {{ padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }}
            .coverage-table th {{ background-color: #2196F3; color: white; }}
            .coverage-good {{ color: #4CAF50; font-weight: bold; }}
            .coverage-medium {{ color: #FF9800; font-weight: bold; }}
            .coverage-poor {{ color: #F44336; font-weight: bold; }}
            .stats {{ display: inline-block; margin: 0 15px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Test Results Report</h1>
            <h2>{overall_status}</h2>
            <p>{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
        </div>

        <div class="summary">
            <h2>📊 Overall Summary</h2>
            <div class="stats">
                <strong>Total Tests:</strong> {total_tests}
            </div>
            <div class="stats">
                <strong class="passed">Passed:</strong> <span class="passed">{total_passed}</span>
            </div>
            <div class="stats">
                <strong class="failed">Failed:</strong> <span class="failed">{total_failed}</span>
            </div>
            <div class="stats">
                <strong>Success Rate:</strong> {(total_passed/total_tests*100) if total_tests > 0 else 0:.1f}%
            </div>
        </div>
    """

    # Vitest Section
    html += f"""
        <div class="test-section">
            <h3>🧪 Vitest (Unit Tests)</h3>
            <p>
                Total: {vitest_results['total']} |
                <span class="passed">Passed: {vitest_results['passed']}</span> |
                <span class="failed">Failed: {vitest_results['failed']}</span>
            </p>
    """

    if vitest_results['failures']:
        html += "<h4>❌ Failed Tests:</h4>"
        for failure in vitest_results['failures'][:10]:  # Limit to 10
            html += f'<div class="failure-box">{failure}</div>'
    else:
        html += '<p class="passed">✅ All Vitest tests passed!</p>'

    html += "</div>"

    # Selenium Section
    html += f"""
        <div class="test-section">
            <h3>🌐 Selenium (E2E Tests)</h3>
            <p>
                Total: {selenium_results['total']} |
                <span class="passed">Passed: {selenium_results['passed']}</span> |
                <span class="failed">Failed: {selenium_results['failed']}</span>
            </p>
    """

    if selenium_results['failures']:
        html += "<h4>❌ Failed Tests:</h4>"
        for failure in selenium_results['failures'][:10]:
            html += f'<div class="failure-box">{failure}</div>'
    else:
        html += '<p class="passed">✅ All Selenium tests passed!</p>'

    html += "</div>"

    # Playwright Section
    html += f"""
        <div class="test-section">
            <h3>🎭 Playwright (E2E Tests)</h3>
            <p>
                Total: {playwright_results['total']} |
                <span class="passed">Passed: {playwright_results['passed']}</span> |
                <span class="failed">Failed: {playwright_results['failed']}</span>
            </p>
    """

    if playwright_results['failures']:
        html += "<h4>❌ Failed Tests:</h4>"
        for failure in playwright_results['failures']:
            html += f'<div class="failure-box">{failure}</div>'
    else:
        html += '<p class="passed">✅ All Playwright tests passed!</p>'

    html += "</div>"

    # Coverage Section
    if coverage:
        html += """
        <div class="test-section">
            <h3>📈 Code Coverage</h3>
            <table class="coverage-table">
                <tr>
                    <th>Metric</th>
                    <th>Coverage</th>
                    <th>Status</th>
                </tr>
        """

        for metric, value in coverage.items():
            css_class = 'coverage-good' if value >= 70 else 'coverage-medium' if value >= 50 else 'coverage-poor'
            status = '✅ Good' if value >= 70 else '⚠️ Fair' if value >= 50 else '❌ Poor'
            html += f"""
                <tr>
                    <td>{metric.capitalize()}</td>
                    <td class="{css_class}">{value:.1f}%</td>
                    <td>{status}</td>
                </tr>
            """

        html += """
            </table>
        </div>
        """

    html += """
        <div class="summary">
            <p><em>🤖 Generated automatically by Brownbag Test Runner</em></p>
        </div>
    </body>
    </html>
    """

    return html

def send_email(html_body, screenshots=None):
    """Send email with test results and optional screenshots."""
    sender_email = os.getenv('GMAIL_SENDER')
    app_password = os.getenv('GMAIL_APP_PASSWORD')
    recipient_email = os.getenv('TEST_EMAIL_RECIPIENT')

    if not all([sender_email, app_password, recipient_email]):
        print("ERROR: Missing required environment variables:")
        print("  - GMAIL_SENDER")
        print("  - GMAIL_APP_PASSWORD")
        print("  - TEST_EMAIL_RECIPIENT")
        sys.exit(1)

    msg = MIMEMultipart('mixed')
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = f'Test Results - {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}'

    # Attach HTML body
    msg.attach(MIMEText(html_body, 'html'))

    # Attach screenshots if provided
    if screenshots:
        for screenshot_path in screenshots:
            if os.path.exists(screenshot_path):
                try:
                    with open(screenshot_path, 'rb') as f:
                        img_data = f.read()

                    image = MIMEImage(img_data, name=os.path.basename(screenshot_path))
                    image.add_header('Content-Disposition', 'attachment', filename=os.path.basename(screenshot_path))
                    msg.attach(image)
                    print(f"  Attached screenshot: {os.path.basename(screenshot_path)}")
                except Exception as e:
                    print(f"  Warning: Could not attach {screenshot_path}: {str(e)}")

    try:
        print(f"Connecting to Gmail SMTP server...")
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            print(f"Logging in as {sender_email}...")
            server.login(sender_email, app_password)
            print(f"Sending email to {recipient_email}...")
            server.send_message(msg)
            print(f"\n✅ Email sent successfully!")
    except Exception as e:
        print(f"\n❌ Failed to send email: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) != 5:
        print("Usage: send-test-results-email.py <vitest_output> <selenium_output> <playwright_output> <coverage_file>")
        sys.exit(1)

    vitest_file = sys.argv[1]
    selenium_file = sys.argv[2]
    playwright_file = sys.argv[3]
    coverage_file = sys.argv[4]

    # Parse all test results
    print("Parsing test results...")
    vitest_results = parse_vitest_output(vitest_file)
    selenium_results = parse_selenium_output(selenium_file)
    playwright_results = parse_playwright_output(playwright_file)
    coverage = parse_coverage(coverage_file)

    # Find Playwright screenshots
    print("Looking for Playwright screenshots...")
    screenshots = []
    playwright_screenshot_dir = ".playwright-mcp"
    if os.path.exists(playwright_screenshot_dir):
        screenshot_files = glob.glob(os.path.join(playwright_screenshot_dir, "*.png"))
        screenshot_files.extend(glob.glob(os.path.join(playwright_screenshot_dir, "*.jpg")))
        screenshots = sorted(screenshot_files)  # Sort to ensure consistent order
        print(f"Found {len(screenshots)} screenshot(s)")
    else:
        print("No Playwright screenshot directory found")

    # Generate HTML email
    print("Generating email report...")
    html_body = generate_html_email(vitest_results, selenium_results, playwright_results, coverage)

    # Send email with screenshots
    send_email(html_body, screenshots)
