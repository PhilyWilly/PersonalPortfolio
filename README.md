# Personal Portfolio

A modern, interactive personal portfolio website built with **FastAPI** and **JavaScript**, featuring multi-language support and a sleek hacker-style interface.

## Features

- **Multi-Language Support**: English and German translations
- **Interactive Canvas**: Dynamic background animations with ASCII art elements
- **CV Download**: Easy access to download your curriculum vitae
- **WebSocket Support**: Real-time terminal-like interactions
- **Responsive Design**: Works seamlessly across all devices
- **Matrix Earth Visualization**: Unique ASCII art representation of Earth
- **Terminal Emulator**: Interactive terminal interface for creative interaction

## Quick Start

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PhilyWilly/PersonalPortfolio.git
cd PersonalPortfolio
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the root directory with your email configuration:
```
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=your_email@example.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
```

4. Run the application:
```bash
python3 main.py
```

The portfolio will be available at `http://localhost:9600`

## Project Structure

```
PersonalPortfolio/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── messages.txt           # Message storage
├── languages/             # Translation files
│   ├── de.json           # German translations
│   └── en.json           # English translations
├── static/                # Static assets
│   │   style.css
│   │   src/          # Source JavaScript modules
│   │   ├── classes/
│   │   │   ├── canvas.js
│   │   │   ├── message.js
│   │   │   └── terminal.js
│   │   ├── data/
│   │   │   ├── matrix-earth-ascii.js
│   │   │   ├── profile-picture-ascii.js
│   │   │   └── terminal-data.js
│   │   ├── terminal-functions/
│   │   │   ├── basics.js
│   │   │   ├── delay.js
│   │   ├── bitcoin-reciever.js
│   │   ├── console-manager.js
│   │   ├── hacker-background.js
│   │   └── matrix-earth.js
│   ├── files/            # Downloadable files (CV, etc.)
│   └── pics/             # Images
└── templates/            # HTML templates
    └── index.html         
```

## Technologies

- **Backend**: FastAPI, Python
- **Frontend**: HTML5, CSS3, JavaScript
- **Email**: FastAPI-Mail
- **Real-Time**: WebSockets
- **Styling**: Custom CSS with responsive design
- **Localization**: JSON-based translation system

## Key Features Explained

### Multi-Language Support
- Automatic language detection from browser preferences
- Support for English and German
- Easy to extend with additional languages

### Interactive Terminal
A custom terminal emulator that allows visitors to interact with the site in a creative, hacker-style interface

### ASCII Art Elements
- Matrix Earth visualization
- Profile picture ASCII art

### Contact Form
- Direct email integration
- Form validation
- Support for multiple messages

## Contact & Messages

Visitors can send messages through the contact form, which are stored and can be sent via email using your configured SMTP server.

## Customization

### Change Personal Information
Edit the HTML templates in `templates/` to update your name, description, and content

### Modify Translations
Update `languages/en.json` and `languages/de.json` with your preferred content

## License

This project is open source and available under the MIT License.

## Author

**David Wesch**
- Portfolio: [Live Demo](http://localhost:8000)
- GitHub: [@PhilyWilly](https://github.com/PhilyWilly)

## Support

Have questions or found a bug? Feel free to open an issue on GitHub.

---

⭐ **If you found this portfolio inspiring, consider giving it a star!**
