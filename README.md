# Shipping and Ticketing System

A full-stack shipping management and ticketing system built with Node.js, Express, PostgreSQL, and Sequelize. The system provides real-time shipment tracking, support ticket management, and a comprehensive admin dashboard.

## Features

- 📦 Shipment creation and tracking
- 🎫 Support ticket management
- 🔄 Real-time status updates
- 📊 Admin dashboard
- 🔍 Customer tracking interface
- 📱 Mobile-responsive design

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Frontend**: HTML5, Bootstrap 5, JavaScript
- **Real-time Updates**: Auto-refresh
- **API**: RESTful endpoints

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/AITicketingSystem.git
cd AITicketingSystem
```

2. Install dependencies:
```bash
npm install
```

## Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL:
   - **macOS**: `brew install postgresql`
   - **Ubuntu/Debian**: `sudo apt-get install postgresql`
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

2. Start PostgreSQL service:
   - **macOS**: `brew services start postgresql`
   - **Ubuntu/Debian**: `sudo service postgresql start`
   - **Windows**: PostgreSQL is installed as a service and starts automatically

3. Create a new database:
```sql
psql -U postgres
CREATE DATABASE shipping_system;
```

### Option 2: Supabase (Cloud Hosted)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > Database to get your connection string
4. Copy the connection string and update your `.env` file

## Configuration

1. Copy the environment template:
```bash
cp config/env.example .env
```

2. Update the `.env` file with your database credentials:
```env
# For local PostgreSQL:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shipping_system
DB_USER=your_username
DB_PASSWORD=your_password

# For Supabase:
# DATABASE_URL=postgres://your-connection-string

PORT=3000
NODE_ENV=development
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Access the application:
- Admin Dashboard: http://localhost:3000/admin
- Shipment Management: http://localhost:3000/shipments
- Tracking Page: http://localhost:3000/track.html

## API Documentation

### Shipments

#### Create Shipment
```bash
curl -X POST http://localhost:3000/api/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "origin_address": "123 Sender St, City, Country",
    "destination_address": "456 Receiver Ave, City, Country",
    "package_type": "Small Box",
    "weight": 2.5,
    "dimensions": {
      "length": 20,
      "width": 15,
      "height": 10,
      "unit": "cm"
    },
    "shipping_service": "Standard",
    "signature_required": false
  }'
```

#### Get All Shipments
```bash
curl http://localhost:3000/api/shipments
```

#### Track Shipment
```bash
curl http://localhost:3000/api/shipments/SHIP123456
```

### Support Tickets

#### Create Ticket
```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "tracking_number": "SHIP123456",
    "issue_description": "Package delayed"
  }'
```

#### Get All Tickets
```bash
curl http://localhost:3000/api/tickets
```

## Database Schema

### Shipments Table
| Column | Type | Description |
|--------|------|-------------|
| tracking_number | VARCHAR(255) | Primary Key, Auto-generated |
| status | ENUM | pending, picked_up, in_transit, out_for_delivery, delivered, failed_delivery, returned, exception |
| current_location | VARCHAR(255) | Current location of the shipment |
| origin_address | TEXT | Pickup address |
| destination_address | TEXT | Delivery address |
| delivery_estimate | TIMESTAMP | Estimated delivery date |
| actual_delivery | TIMESTAMP | Actual delivery date |
| package_type | VARCHAR(255) | Type of package |
| weight | FLOAT | Weight in kg |
| dimensions | JSON | Length, width, height in cm |
| shipping_service | VARCHAR(255) | Standard, Express, Priority |
| signature_required | BOOLEAN | Whether signature is required |
| tracking_history | JSON | Array of status updates |
| special_instructions | TEXT | Special handling instructions |
| customer_reference | VARCHAR(255) | Customer's reference number |
| estimated_cost | DECIMAL(10,2) | Estimated shipping cost |

### Tickets Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| customer_name | VARCHAR(255) | Name of the customer |
| tracking_number | VARCHAR(255) | Foreign Key to Shipments |
| issue_description | TEXT | Description of the issue |
| status | VARCHAR(255) | open, in_progress, resolved, closed |
| created_at | TIMESTAMP | Ticket creation time |

## Error Handling

The system includes comprehensive error handling for:
- Invalid tracking numbers
- Database connection issues
- Invalid input validation
- Missing required fields
- API rate limiting
- Unauthorized access

## Contributing

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/amazing-feature
```
3. Commit your changes:
```bash
git commit -m 'Add some amazing feature'
```
4. Push to the branch:
```bash
git push origin feature/amazing-feature
```
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Bootstrap for the responsive UI components
- Express.js for the robust backend framework
- Sequelize for the reliable ORM
- PostgreSQL for the robust database system

# Rasa Shipping Assistant with Twilio Voice Integration

This project integrates a Rasa chatbot with Twilio Voice for handling shipping-related queries through phone calls.

## Features

- Bilingual support (English + Arabic)
- Voice-enabled shipping status queries
- Support ticket creation through voice calls
- Real-time speech-to-text and text-to-speech conversion

## Prerequisites

1. Python 3.9 or higher
2. Rasa 3.x
3. Twilio account with:
   - Account SID
   - Auth Token
   - Phone number with voice capabilities

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file with your Twilio credentials:
```env
# Twilio Credentials
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here

# Rasa Configuration
RASA_WEBHOOK_URL=http://localhost:5005/webhooks/rest/webhook

# Flask Configuration
FLASK_ENV=development
FLASK_APP=twilio_webhook.py
```

## Running the Application

1. Start the Rasa server:
```bash
rasa run --enable-api --cors "*"
```

2. Start the Rasa Action server in a new terminal:
```bash
rasa run actions
```

3. Start the Twilio webhook server:
```bash
python twilio_webhook.py
```

4. Expose the webhook to the internet using ngrok:
```bash
ngrok http 5001
```

## Twilio Configuration

1. In your Twilio Console, go to Phone Numbers > Manage > Active numbers
2. Click on your phone number
3. Under "Voice & Fax" section:
   - Set "A Call Comes In" webhook to: `https://your-ngrok-url/voice`
   - Method: HTTP POST

## Testing

1. Call your Twilio phone number
2. You'll hear the welcome message
3. Speak your query (e.g., "Track my shipment SHIP123456")
4. The assistant will respond with the appropriate information

## Supported Voice Commands

English:
- "Track my shipment"
- "Where is my package"
- "I want to file a complaint"
- "Report an issue with my shipment"

Arabic:
- "تتبع شحنتي"
- "وين شحنتي"
- "أريد تقديم شكوى"
- "عندي مشكلة في الشحنة"

## Architecture

1. User calls Twilio phone number
2. Twilio converts speech to text
3. Flask webhook receives the text
4. Text is sent to Rasa for processing
5. Rasa response is converted to speech via Twilio TwiML
6. User hears the response

## Troubleshooting

1. If ngrok URL is not working:
   - Ensure ngrok is running and the URL is up-to-date in Twilio
   - Check ngrok logs for any connection issues

2. If Rasa is not responding:
   - Verify both Rasa server and Action server are running
   - Check the RASA_WEBHOOK_URL in your .env file

3. If voice recognition is poor:
   - Adjust the `speechTimeout` parameter in `twilio_webhook.py`
   - Add more speech recognition hints for your use case

## Running the Twilio Voice Webhook Server

1. Make sure your Rasa server is running on port 5005:
```bash
rasa run --enable-api --cors "*"
```

2. In a new terminal, run the Twilio webhook server:
```bash
python twilio_webhook.py
```

3. The server will start on http://localhost:5001. Use ngrok to expose this endpoint:
```bash
ngrok http 5001
```

4. Copy the ngrok HTTPS URL and configure your Twilio phone number's voice webhook:
   - Go to Twilio Console > Phone Numbers > Manage > Active numbers
   - Click on your phone number
   - Under "Voice & Fax" section:
     - Set "When a call comes in" to: Webhook
     - Set the webhook URL to: YOUR_NGROK_URL/voice
     - Set HTTP Method to: POST

The server will now:
1. Receive voice calls from Twilio
2. Convert speech to text
3. Send the text to Rasa
4. Convert Rasa's response back to speech
5. Play the response to the caller

## 🐳 Dockerized Stack

This project includes:
- Node.js + Express backend
- PostgreSQL database
- Rasa chatbot (with actions)
- Twilio Flask webhook
- (Optional) Static frontend

### Prerequisites
- Docker & Docker Compose
- `.env` file (see `.env.example` for required variables)

### Quick Start

1. **Copy environment variables:**
   ```sh
   cp .env.example .env
   # Edit .env and fill in your secrets
   ```

2. **Build and start all services:**
   ```sh
   docker-compose up --build
   ```

3. **Access services:**
   - Backend: http://localhost:3000
   - Rasa: http://localhost:5005
   - Rasa Actions: http://localhost:5055
   - Twilio Webhook: http://localhost:5001
   - PostgreSQL: localhost:5432 (see .env for credentials)

4. **Database migrations/seeding:**
   - Use Sequelize CLI or your migration tool inside the backend container.

---

## 🔄 CI/CD with GitHub Actions

- On push or PR to `main`, GitHub Actions will:
  - Build, test, and lint backend
  - Build and push Docker images for backend and Rasa
  - (Extend workflow for deployment as needed)

Workflow file: `.github/workflows/deploy.yml`

---

## 📦 Project Structure

```
backend/           # Node.js + Express app
rasa/              # Rasa chatbot project
rasa/actions/      # Rasa custom actions
public/ or frontend/ # Static frontend (optional)
twilio_webhook/    # Flask webhook for Twilio
Dockerfile         # Backend Dockerfile
.twilio_webhook/Dockerfile # Flask webhook Dockerfile
docker-compose.yml # Orchestration
.env.example       # Example environment variables
```

---

## 📝 Notes
- Update `.env` with your real secrets before running.
- For production, use a secrets manager and secure your environment variables.
- Extend the workflow for deployment to your cloud provider as needed. 