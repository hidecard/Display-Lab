# CSS-Labs Documentation

## Overview

CSS-Labs is an interactive CSS layout playground that allows developers to experiment with Flexbox and Grid layouts in real-time. It provides a visual interface for adjusting CSS properties and generates corresponding HTML and CSS code.

## Key Features

### 1. Layout Modes
- **Flexbox**: Configure flex-direction, flex-wrap, justify-content, align-items, and align-content
- **CSS Grid**: Set up grid templates, auto-rows, gaps, and alignment properties
- **Basic Display**: Block, inline, and inline-block options

### 2. Visual Controls
- Adjust number of items (1-48)
- Control gaps (row and column)
- Modify box dimensions (min-width/height)
- Customize borders, shadows, and backgrounds
- Toggle item labels

### 3. Grid-Specific Features
- Fixed column counts or auto-fit/auto-fill responsive grids
- Individual item spanning (column and row spans)
- Per-item span controls or bulk span assignments

### 4. Preview Options
- Responsive viewport simulation (mobile, tablet, desktop)
- Real-time visual feedback
- Background customization (fixed colors, gradients, or random per item)

### 5. Code Generation
- Clean HTML and CSS output
- Tailwind HTML equivalent
- One-click copy functionality
- Export to CodePen, JSFiddle, or downloadable ZIP

## Technical Implementation

### Core Technologies
- React with hooks (useState, useEffect, useMemo, useRef)
- Bootstrap CSS framework
- Custom CSS for enhanced styling
- JSZip for archive creation

### State Management
- Comprehensive state object tracking all layout parameters
- Local storage persistence (key: 'display-lab-config-v1')
- Undo/redo history functionality (50-state limit)

### Accessibility Features
- Skip to main content link
- ARIA labels and roles
- Keyboard navigation support
- Focus management for modals

## Usage Instructions

### Basic Operation
1. Select a display mode (Flex/Grid)
2. Adjust items and spacing using sliders and inputs
3. Configure layout-specific properties
4. View changes in real-time in the preview area
5. Copy or export the generated code

### Advanced Features
- Use the Settings modal for detailed controls
- Apply presets for common layout patterns
- Export/import configurations as JSON files
- Utilize undo/redo for experimentation

## Code Structure

### Main Components
- **DisplayLab**: Primary container component managing all state
- **Section**: Container for organized control groups
- **Toggle**: Radio-style button group component
- **Slider**: Range input with visual feedback
- **NumberField**: Numeric input with validation
- **Select**: Dropdown selector
- **CodeBlock**: Code display and export interface

### Key Functions
- `getState()`/`applyState()`: State serialization/deserialization
- `exportToCodePen()`/`exportToJSFiddle()`: External platform integration
- `downloadZip()`: Archive creation for offline use
- `parseIndices()`: Validation for grid span indices

## Browser Compatibility

Works in all modern browsers that support:
- CSS Grid and Flexbox
- ES6+ JavaScript features
- Clipboard API

## Performance Considerations

- Memoized calculations prevent unnecessary re-renders
- History limited to 50 states to prevent memory issues
- Lazy loading of JSZip library

## Customization

The application can be customized by:
- Modifying the color scheme in the custom styles section
- Adding new presets to the preset configuration
- Extending the layout options with additional CSS properties

## License

Open source educational tool created by Arkar Yan.

For more information, visit [Arkar Yan's portfolio](https://arkaryan.vercel.app/).
