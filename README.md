# HealthMate Edge

AI-powered patient health report analysis application built with [Llama-3.1-8B-Chat8K (via AnythingLLM)](https://anythingllm.com/) and ElectronJS for [Qualcomm Snapdragon Elite-X Arm64](https://www.qualcomm.com/products/mobile/snapdragon/pcs-and-tablets/snapdragon-elite-x-platform) chipsets.

Google Drive Link for the exe. file: https://drive.google.com/drive/folders/19fz0A14TL5c6c8A5NaWOJjoNKNz7BXIf?usp=sharing

### Table of Contents

[1. Purpose](#purpose)<br>
[2. Features](#features)<br>
[3. Code Organization](#code-organization)<br>
[4. Implementation](#implementation)<br>
[5. Setup](#setup)<br>
[6. Usage](#usage)<br>
[7. Building an Executable](#building-an-executable)<br>
[8. Contributing](#contributing)<br>
[9. Code of Conduct](#code-of-conduct)<br>

### Purpose

HealthMate Edge is a desktop application designed to intelligently analyze and summarize patient health reports using local AI processing. The application provides healthcare professionals and patients with quick, accurate summaries of medical documents while maintaining data privacy through offline processing.

### Features

**Health Report Analysis**

- Intelligent summarization of patient health reports
- Local processing with Llama-3.1-8B-Chat8K model for data privacy
- Support for various medical document formats

**Dual User Modes**

- **Doctor Mode**: Quick bullet points and key insights for rapid review
- **Patient Mode**: Comprehensive summaries with two sub-modes:
  - _Concise_: Brief, easy-to-understand overview
  - _Detailed_: In-depth explanation with medical context

**Text-to-Speech Integration**

- Audio transcription of generated summaries
- Accessibility support for visually impaired users
- Natural voice synthesis for medical content

**Cross-Platform Compatibility**

- Native Windows .exe application
- Optimized for Qualcomm Snapdragon Elite-X Arm64 architecture
- Built with ElectronJS for consistent performance

### Code Organization

This project provides a modular architecture for healthcare document processing:

**Frontend (ElectronJS)**

- `src/renderer/` - Main application UI components
- `src/renderer/components/` - Reusable UI components
- `src/renderer/pages/` - Application pages and views
- `src/renderer/styles/` - CSS and styling files

**Backend Processing**

- `src/main/` - Electron main process
- `src/main/ai/` - Llama-3.1-8B-Chat8K integration and model handling
- `src/main/tts/` - Text-to-speech processing
- `src/main/parsers/` - Document parsing utilities

**Models & Configuration**

- `models/` - Llama-3.1-8B-Chat8K model files and configurations
- `config/` - Application settings and AI model parameters

### Implementation

This app was built for the Snapdragon X Elite ARM64 architecture but designed to be cross-platform compatible. Performance is optimized for local AI processing without requiring cloud connectivity.

**Target Platform:**

- Machine: Qualcomm Snapdragon Elite-X devices
- Architecture: ARM64
- OS: Windows 11
- Memory: 16+ GB recommended
- Storage: 8+ GB for models and application

**Technology Stack:**

- ElectronJS for cross-platform desktop application
- Llama-3.1-8B-Chat8K for natural language processing
- Native text-to-speech APIs
- Local file processing for privacy

### Setup

1. **Install Node.js and npm**

   - Download and install [Node.js](https://nodejs.org/) (version 18 or higher)
   - Verify installation: `node --version` and `npm --version`

2. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/healthmate-edge.git
   cd healthmate-edge
   ```

3. **Install dependencies**

   ```bash
   # Install npm dependencies
   npm install
   ```

4. **Download AnythingLLM Desktop app to access the Llama-3.1-8B-Chat8K model**

   1. Download the AnythingLLM Desktop app.
   2. Download the Llama-3.1-3b-chat8k model from Settings > AI Providers > LLM 
   3. Ensure that the model is active in the background. 

5. **Configure the AnythingLLM API**

    1. Create workspace and use that as slug for the API calls
    2. Using the /chat endpoint from the co in the chat mode to generate text summary
    setting the "Chat History" as 5 and "LLM Temperature" as 0.7.


### Usage

#### Development Mode

Start the application in development mode:

```bash
# Start the Electron app
npm run dev

# Or start with debugging
npm run dev:debug
```

#### Document Processing

1. **Launch HealthMate Edge**
2. **Select User Mode**:
   - Choose "Doctor Mode" for quick bullet points
   - Choose "Patient Mode" for detailed summaries
3. **Upload Health Report**:
   - Click "Upload Document" or drag and drop files
   - Supported formats: PDF, DOCX, TXT
4. **Generate Summary**:
   - Click "Analyze Report" to process with Llama-3.1-8B-Chat8K
   - Select summary type (Concise/Detailed for Patient mode)
5. **Text-to-Speech**:
   - Click "Read Aloud" to hear the summary
   - Adjust voice settings in preferences

#### Example Usage

**Doctor Mode Output:**

```
• Patient: John Doe, Age 45
• Primary Concern: Elevated blood pressure
• Key Findings: BP 150/95, cholesterol 240 mg/dL
• Recommendations: Lifestyle changes, medication review
• Follow-up: 2 weeks
```

**Patient Mode (Minimal):**

```
Your recent health report shows slightly elevated blood pressure and cholesterol levels.
Your doctor recommends dietary changes and regular exercise. A follow-up appointment
is scheduled in 2 weeks to monitor your progress.
```

**Patient Mode (Comprehensive):**

```
Your recent health checkup showed that both your blood pressure and cholesterol levels are a little higher than what doctors usually consider healthy. This doesn’t mean there’s an immediate danger, but it is a sign that your body could benefit from some lifestyle changes to lower the risk of future health problems like heart disease.
Your doctor has advised you to:

- Make some changes to your diet, such as eating more fruits, vegetables, and whole grains, while cutting down on foods high in salt, sugar, and unhealthy fats.
- Exercise regularly, even simple activities like brisk walking, cycling, or light workouts most days of the week can make a difference.

To keep track of how these changes are working, your doctor has scheduled a follow-up visit in 2 weeks. At that appointment, they’ll check your blood pressure and cholesterol again, talk about any progress you’ve made, and adjust recommendations if needed.

In the meantime, focus on healthy daily habits—small steps now can make a big impact on your long-term health.
```

### Building an Executable

To create a standalone .exe file for Windows ARM64:

1. **Build the application**:

   ```bash
   # Build for Windows ARM64
   npm run build:win-arm64

   # Or build for all platforms
   npm run build:all
   ```

2. **Package with models**:

   ```bash
   # Run the packaging script
   npm run package
   ```

3. **Find your executable** in the `dist` folder:

   - `HealthMate-Edge-Setup.exe` - Installer
   - `HealthMate-Edge.exe` - Portable executable

4. **Distribution requirements**:

   - Copy the `models/` folder to the installation directory
   - Include `config/` folder with default settings
   - Ensure Visual C++ Redistributable is installed

5. **Installation**:
   - Run the installer on target Snapdragon Elite-X devices
   - First launch will initialize AI models (may take 2-3 minutes)
   - No internet connection required for operation

### Performance Notes

**Snapdragon Elite-X Optimization:**

- Model loading: ~30-45 seconds on first launch
- Document processing: ~10-30 seconds depending on length
- TTS generation: ~2-5 seconds per summary
- Memory usage: ~4-6 GB during processing

### Contributors 
- Deepali Singh: deepalisingh2k@gmail.com
- Sricharan Ramesh: charan1952001@gmail.com
- Deepesh Parpani: deepesh.parpani@gmail.com
- Mayurika Borah: borah.mayurika@gmail.com
- Aviral Gupta: avi23032002@gmail.com

### Contributing

Contributions to enhance HealthMate Edge are welcome and encouraged. Please review the [contribution guide](CONTRIBUTING.md) prior to submitting a pull request.

**Development Guidelines:**

- Maintain HIPAA compliance considerations
- Test on Snapdragon Elite-X hardware when possible
- Ensure offline functionality for data privacy
- Follow healthcare software best practices

**Areas for Contribution:**

- Additional medical document format support
- Enhanced AI model fine-tuning for medical content
- Improved accessibility features
- Multi-language support
- Integration with EHR systems

### Code of Conduct

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). Read more about it in the [code of conduct](CODE_OF_CONDUCT.md) file.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Disclaimer

HealthMate Edge is designed as an assistive tool for healthcare document analysis. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical decisions.



