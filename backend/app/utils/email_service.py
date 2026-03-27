import os
# --- CORRECTED IMPORTS: Added 'Configuration' ---
from sib_api_v3_sdk import ApiClient, TransactionalEmailsApi, Configuration
from sib_api_v3_sdk.rest import ApiException
from sib_api_v3_sdk.models import SendSmtpEmail, SendSmtpEmailSender, SendSmtpEmailTo
from fastapi import BackgroundTasks

# 1. Configuration
API_KEY = os.getenv("BREVO_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "noreply@myapp.com")
SENDER_NAME = os.getenv("SENDER_NAME", "My App")

def send_email_via_brevo(to_email: str, subject: str, html_content: str):
    if not API_KEY:
        print("⚠️ BREVO_API_KEY not found in .env")
        return

    # --- FIXED INITIALIZATION ---
    # 1. Create a Configuration object
    configuration = Configuration()
    # 2. Set the API key on the Configuration
    configuration.api_key['api-key'] = API_KEY
    
    # 3. Pass the configuration to ApiClient
    api_instance = TransactionalEmailsApi(ApiClient(configuration))

    # Define the Sender
    sender = SendSmtpEmailSender(
        email=SENDER_EMAIL,
        name=SENDER_NAME
    )

    # Define the Recipient
    to = [SendSmtpEmailTo(email=to_email)]

    # Create the Email Object
    send_smtp_email = SendSmtpEmail(
        sender=sender,
        to=to,
        subject=subject,
        html_content=html_content
    )

    try:
        api_instance.send_transac_email(send_smtp_email)
        print(f"✅ Email sent successfully to {to_email} via Brevo")
    except ApiException as e:
        print(f"❌ Exception when calling TransactionalEmailsApi->send_transac_email: {e}")
    except Exception as e:
        print(f"❌ Failed to send email via Brevo: {e}")

# --- TEMPLATES ---

def send_booking_confirmation_email(
    background_tasks: BackgroundTasks, 
    to_email: str, 
    client_name: str, 
    service_name: str, 
    event_date: str
):
    subject = "Booking Confirmed! 🎉"
    
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Booking Confirmed</h2>
          </div>
          <div style="padding: 20px;">
            <p>Hi <strong>{client_name}</strong>,</p>
            <p>Great news! Your booking has been confirmed by the provider.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Service:</strong> {service_name}</p>
              <p><strong>Date:</strong> {event_date}</p>
            </div>
            
            <p>We look forward to serving you!</p>
            <p style="font-size: 0.9em; color: #666;">Thank you for choosing our platform.</p>
          </div>
        </div>
      </body>
    </html>
    """
    background_tasks.add_task(send_email_via_brevo, to_email, subject, html)

def send_new_booking_notification(
    background_tasks: BackgroundTasks, 
    provider_email: str, 
    client_name: str, 
    service_name: str, 
    event_date: str, 
    guests: int
):
    subject = "New Booking Request Received 📅"
    
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0ea5e9; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">New Booking Request</h2>
          </div>
          <div style="padding: 20px;">
            <p>Hello,</p>
            <p>You have received a new booking request from <strong>{client_name}</strong>.</p>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
              <p><strong>Service:</strong> {service_name}</p>
              <p><strong>Date:</strong> {event_date}</p>
              <p><strong>Guests:</strong> {guests}</p>
            </div>
            
            <p>Please log in to your dashboard to review and confirm this booking.</p>
          </div>
        </div>
      </body>
    </html>
    """
    background_tasks.add_task(send_email_via_brevo, provider_email, subject, html)