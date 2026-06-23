# GuiltMeter WebPack V1

GuiltMeter is a web-based scoring application that helps users quantify and manage their "guilt" across four key areas: Environmental Impact, Management Actions, Self-Help Remedies, and Security Practices. The app uses interactive sliders, real-time calculations, and visual feedback to create an engaging guilt-assessment experience.

## Features

- **Interactive Sliders**: Adjust guilt levels across multiple categories with visual gradient feedback
- **Real-time Scoring**: Instant guilt score calculation with animated gauge visualization
- **Remedy System**: Apply self-help, management, and violation remedies to reduce guilt scores
- **Audio Feedback**: Optional Jimmy Buffett audio celebration when guilt is sufficiently reduced
- **Dark Mode**: Toggle between light and dark themes
- **Data Persistence**: Automatic save/restore of slider values and settings via localStorage
- **Export/Import**: Backup and restore your guilt meter data
- **Responsive Design**: Built with Bootstrap 5 for mobile-friendly layouts

## How to Use

### Getting Started

1. Open the app in your browser (default: `http://localhost:3000`)
2. Adjust the sliders in each section to reflect your current guilt levels
3. Watch the gauge update in real-time as you make changes
4. Apply remedies from the Self-Help or Management sections to reduce guilt
5. Toggle dark mode using the theme button in the top-right corner

### Sections

1. **Environmental Guilt**: Rate your environmental impact (power usage, recycling, etc.)
2. **Management Actions**: Rate management-related guilt factors
3. **Self-Help Remedies**: Apply remedies to reduce your guilt score
4. **Security Guilt**: Rate security-related guilt factors

### Controls

- **Sliders**: Drag to adjust values (0-10 scale)
- **Checkboxes**: Enable/disable specific options like WFH (Work From Home) approval
- **Remedy Buttons**: Click to apply remedies that reduce guilt scores
- **Audio Toggle**: Enable/disable the celebration audio
- **Theme Toggle**: Switch between light and dark modes
- **Export/Import**: Save your data to a file or restore from a backup

## Developer Setup

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd GuiltMeterWebPackV1_Project

# Install dependencies
npm install
```

### Development

```bash
# Start the development server with hot reloading
npm run serve:webdev
```

The app will be available at `http://localhost:3000`.

### Building for Production

```bash
# Create a production build
npm run build:webdev
```

The built files will be output to the `dist/` directory.

### Testing the Build

**Option 1: Preview with a local server (recommended)**
```bash
npm run preview
```
This builds the project and serves the `dist/` folder using `npx serve dist`.

**Option 2: Open directly in browser**
```bash
npm run build:webdev
```
Then open `dist/index.html` in your browser.

> **Note**: The build uses relative asset paths (`publicPath: './'`) so the app works when opened directly via `file://`. If you see `ERR_FILE_NOT_FOUND` for CSS/JS files, ensure you are opening the built `dist/index.html` and not the source `src/index.html`.

### Available Scripts

- `npm run serve:webdev` - Start webpack dev server with hot reloading
- `npm run build:webdev` - Create development build in `dist/`
- `npm run build:webprod` - Create production build in `dist/`
- `npm run preview` - Build and serve `dist/` locally
- `npm test` - Run test suite (if configured)

### Project Structure

```
├── src/
│   ├── index.html          # Main HTML template
│   ├── js/
│   │   ├── main.js         # Application entry point
│   │   ├── gauge.js        # D3.js gauge visualization
│   │   ├── audio.js        # Audio player and confetti
│   │   ├── calculations.js # Guilt score calculations
│   │   ├── remedies.js     # Remedy system logic
│   │   ├── storage.js      # Data persistence
│   │   ├── ui.js           # UI helpers and validation
│   │   └── state.js        # Shared application state
│   ├── scss/
│   │   └── main.scss       # Custom styles + Bootstrap
│   └── css/
│       └── styles.css      # Compiled CSS output
├── public/                 # Static assets
├── CodeToConvert/          # Legacy HTML/assets
├── webpack.config.js       # Webpack configuration
├── babel.config.json       # Babel configuration
├── jest.config.cjs         # Jest test configuration
└── package.json            # Project dependencies
```

### Technologies Used

- **Webpack 5** - Module bundler and dev server
- **Bootstrap 5** - UI framework and components
- **D3.js v7** - Gauge visualization
- **SCSS** - Styling with Bootstrap integration
- **Babel** - JavaScript transpilation
- **Jest** - Testing framework

### Configuration

Key configuration files:
- `webpack.config.js` - Build configuration, entry points, and plugins
- `babel.config.json` - Babel presets and transpilation rules
- `jest.config.cjs` - Test environment and coverage settings
- `src/scss/main.scss` - Custom theme variables and styles

## License

MIT