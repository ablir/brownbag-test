#!/usr/bin/env python3
"""
Send login test screenshots via email using Gmail SMTP.
Requires environment variables:
- GMAIL_SENDER: Gmail address to send from
- GMAIL_APP_PASSWORD: Gmail App Password (not regular password)
- TEST_EMAIL_RECIPIENT: Email address to receive screenshots
"""

import os
import smtplib
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from datetime import datetime
from pathlib import Path

def send_test_email(screenshot_dir):
    # Get credentials from environment
    sender_email = os.getenv('GMAIL_SENDER')
    app_password = os.getenv('GMAIL_APP_PASSWORD')
    recipient_email = os.getenv('TEST_EMAIL_RECIPIENT')

    if not all([sender_email, app_password, recipient_email]):
        print("ERROR: Missing required environment variables:")
        print("  - GMAIL_SENDER")
        print("  - GMAIL_APP_PASSWORD")
        print("  - TEST_EMAIL_RECIPIENT")
        sys.exit(1)

    # Create message
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = f'Login Flow Test Results - {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}'

    # Email body
    body = """
    <h2>Login Flow Test Results</h2>
    <p>Automated test executed at: {}</p>

    <h3>Test Steps:</h3>
    <ol>
        <li><strong>Initial Login Page</strong> - Clean login form displayed</li>
        <li><strong>Filled Login Form</strong> - Test credentials entered (testuser123/password456)</li>
        <li><strong>User Profile Page</strong> - Successfully authenticated and profile displayed</li>
    </ol>

    <p>Screenshots are attached to this email.</p>

    <hr>
    <p><em>Generated automatically by /test-login command</em></p>
    """.format(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    msg.attach(MIMEText(body, 'html'))

    # Attach screenshots
    screenshots = [
        ('01-login-page.png', 'Initial Login Page'),
        ('02-filled-login-form.png', 'Filled Login Form'),
        ('03-user-profile-page.png', 'User Profile Page')
    ]

    for filename, description in screenshots:
        filepath = Path(screenshot_dir) / filename
        if filepath.exists():
            with open(filepath, 'rb') as f:
                img = MIMEImage(f.read())
                img.add_header('Content-Disposition', 'attachment', filename=filename)
                img.add_header('Content-ID', f'<{filename}>')
                msg.attach(img)
            print(f"✓ Attached: {filename}")
        else:
            print(f"⚠ Warning: Screenshot not found: {filepath}")

    # Send email
    try:
        print(f"\nConnecting to Gmail SMTP server...")
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            print(f"Logging in as {sender_email}...")
            server.login(sender_email, app_password)
            print(f"Sending email to {recipient_email}...")
            server.send_message(msg)
            print(f"\n✅ Email sent successfully!")
            print(f"   From: {sender_email}")
            print(f"   To: {recipient_email}")
            print(f"   Subject: {msg['Subject']}")
    except Exception as e:
        print(f"\n❌ Failed to send email: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: send-test-email.py <screenshot_directory>")
        sys.exit(1)

    screenshot_dir = sys.argv[1]
    send_test_email(screenshot_dir)
