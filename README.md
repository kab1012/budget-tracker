# Personal Budget Tracker

A full-stack web application for tracking personal finances, built with Django and React.

## Features

- User authentication (login/register)
- Transaction management (income/expenses)
- Category management
- Monthly budget planning
- Financial summary with charts
- Responsive design for mobile and desktop

## Tech Stack

### Backend
- Python 3.8+
- Django 4.2
- Django REST Framework
- PostgreSQL

### Frontend
- React 18
- TypeScript
- Material-UI
- Redux Toolkit
- React Router
- D3.js for charts

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- PostgreSQL
- npm or yarn

## Setup

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database and secret key settings
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API URL
```

3. Start the development server:
```bash
npm start
```

## Development

- Backend API runs on http://localhost:8000
- Frontend development server runs on http://localhost:3000
- API documentation is available at http://localhost:8000/api/docs/

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 