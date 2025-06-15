from flask import Flask, request, Response
import requests
from twilio.twiml.voice_response import VoiceResponse
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Rasa webhook URL
RASA_WEBHOOK_URL = "http://localhost:5005/webhooks/rest/webhook"

@app.route("/voice", methods=["GET", "POST"])
def voice():
    print("==== /voice endpoint was hit ====")
    # Debug logging
    logger.debug("Received Twilio request:")
    logger.debug(f"Request method: {request.method}")
    logger.debug(f"Request headers: {dict(request.headers)}")
    logger.debug(f"Form data: {request.form}")
    logger.debug(f"SpeechResult: {request.form.get('SpeechResult', '')}")
    
    response = VoiceResponse()
    
    # Always greet the user if this is the first call or no speech detected
    user_message = request.form.get("SpeechResult", "")
    if request.method == "GET" or not user_message:
        gather = response.gather(
            input='speech',
            action='/voice',
            method='POST',
            language='en-US',
            speechTimeout='auto'
        )
        gather.say("Welcome to our shipping assistant. How can I help you today?")
        twiml_response = str(response)
        logger.debug(f"Sending greeting TwiML response: {twiml_response}")
        return twiml_response, 200, {"Content-Type": "text/xml"}
    
    try:
        # Send the message to Rasa
        logger.debug(f"Sending to Rasa: {user_message}")
        rasa_response = requests.post(
            RASA_WEBHOOK_URL,
            json={
                "sender": "twilio_user",
                "message": user_message
            },
            timeout=5  # 5 second timeout
        )
        rasa_response.raise_for_status()
        
        # Get the first response from Rasa
        rasa_messages = rasa_response.json()
        logger.debug(f"Rasa response: {rasa_messages}")
        if rasa_messages:
            bot_message = rasa_messages[0]["text"]
        else:
            bot_message = "I'm sorry, I couldn't understand that. Could you please rephrase?"
            
    except requests.exceptions.Timeout:
        logger.error("Timeout error connecting to Rasa")
        bot_message = "I'm sorry, but I'm taking too long to process your request. Please try again."
    except requests.exceptions.RequestException as e:
        logger.error(f"Error communicating with Rasa: {e}")
        bot_message = "I'm having trouble connecting to my brain right now. Please try again in a moment."
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        bot_message = "Something unexpected happened. Please try again."
    
    # Add the response to TwiML
    response.say(bot_message)
    
    # Add option to continue conversation
    gather = response.gather(
        input='speech',
        action='/voice',
        method='POST',
        language='en-US',
        speechTimeout='auto'
    )
    gather.say("Is there anything else I can help you with?")
    
    twiml_response = str(response)
    logger.debug(f"Sending TwiML response: {twiml_response}")
    return twiml_response, 200, {"Content-Type": "text/xml"}

@app.route("/", methods=["GET"])
def home():
    return "Twilio webhook server is running. Use the /voice endpoint for voice calls."

if __name__ == "__main__":
    logger.info("Starting Twilio webhook server on http://localhost:5001")
    logger.info("Make sure Rasa is running on http://localhost:5005")
    app.run(port=5001, debug=True) 