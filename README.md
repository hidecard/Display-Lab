## **Overview**
  **Css-Labs** is a web-based tool designed to help developers learn and experiment with CSS layouts (Flexbox and Grid). It provides a live preview of layout changes, a settings panel to adjust properties, and options to export code to platforms like CodePen, JSFiddle, or as a ZIP file. The application uses React for the UI, Bootstrap for basic styling, and custom CSS for enhanced visuals. It also supports saving configurations to `localStorage`, undo/redo functionality, and importing/exporting configurations as JSON.

---

## **Key Features**
1. **Interactive Layout Preview**: Visualize Flexbox or Grid layouts with real-time updates.
2. **Configurable Properties**: Adjust display mode, gaps, alignment, item spans, and styling (e.g., border radius, shadows, background).
3. **Code Generation**: Outputs HTML, CSS, and Tailwind CSS code based on the configured layout.
4. **Export Options**: Export to CodePen, JSFiddle, or download as a ZIP file.
5. **Undo/Redo**: Track changes with a history stack (up to 50 states).
6. **Responsive Preview**: Simulate different viewport sizes (Auto, Mobile, Tablet, Desktop).
7. **Accessibility**: Includes ARIA attributes and a "Skip to main content" link.
8. **Presets**: Predefined layouts for quick experimentation.
9. **Settings Modal**: Advanced configuration options organized into tabs (Presets, Display, Flex, Grid, etc.).
10. **Local Storage**: Persists user configurations across sessions.

---

## **File Structure**
The code is a single React file with the following structure:
- **Imports**: React hooks, Bootstrap CSS, and `createRoot` from `react-dom`.
- **Custom Styles**: CSS for styling range sliders (`slider-thumb`).
- **Components**: Reusable UI components (`IconBase`, `Section`, `Toggle`, `Slider`, `NumberField`, `Select`, `CodeBlock`, `DisplayLab`).
- **Main Application**: The `DisplayLab` component, which orchestrates the UI and logic.
- **Rendering**: Renders the `DisplayLab` component into a DOM element with ID `root`.

---

## **Components**

### **1. IconBase**
A reusable SVG icon component that renders icons with customizable `className`.
- **Props**:
  - `children`: SVG paths or shapes to render.
  - `className`: CSS classes for styling.
- **Usage**: Base component for icons like `CopyIcon`, `CheckIcon`, `Code2Icon`, `LayoutIcon`, `Grid3X3Icon`, and `Rows3Icon`.
- **Example**:
  ```jsx
  <CopyIcon className="w-4 h-4 text-indigo-600" />
  ```

### **2. Section**
A styled container for grouping related controls or content.
- **Props**:
  - `title`: Section title (string).
  - `children`: Content inside the section.
  - `icon`: Icon component to display next to the title.
  - `className`: Additional CSS classes.
- **Features**:
  - Renders a card-like container with a gradient header, shadow, and border.
  - Supports an icon and a decorative underline.
- **Example**:
  ```jsx
  <Section title="Live Preview" icon={LayoutIcon}>
    {/* Content */}
  </Section>
  ```

### **3. Toggle**
A radio-button-like component for selecting one option from a list.
- **Props**:
  - `options`: Array of objects with `value`, `label`, and optional `title`.
  - `value`: Current selected value.
  - `onChange`: Callback to handle value changes.
- **Features**:
  - Displays buttons with active/inactive states.
  - Uses ARIA attributes (`aria-pressed`, `aria-checked`) for accessibility.
  - Supports hover and focus states with transitions.
- **Example**:
  ```jsx
  <Toggle
    value={display}
    onChange={setDisplay}
    options={[{ label: 'Flex', value: 'flex' }, { label: 'Grid', value: 'grid' }]}
  />
  ```

### **4. Slider**
A range input for selecting numeric values with a custom-styled thumb.
- **Props**:
  - `label`: Input label.
  - `value`: Current value.
  - `min`, `max`, `step`: Range constraints.
  - `onChange`: Callback for value changes.
  - `suffix`: Unit to display (e.g., `px`).
  - `id`: Unique identifier for accessibility.
- **Features**:
  - Custom thumb styling with hover effects (defined in `customStyles`).
  - Displays a gradient track based on the value.
  - Shows the current value with a suffix.
- **Example**:
  ```jsx
  <Slider id="items-slider" label="Number of Items" value={items} min={1} max={12} onChange={setItems} />
  ```

### **5. NumberField**
A numeric input field for precise value entry.
- **Props**:
  - `label`, `value`, `min`, `max`, `step`, `suffix`, `id`: Similar to `Slider`.
  - `onChange`: Callback for value changes.
- **Features**:
  - Validates input within `min` and `max`.
  - Displays a suffix (e.g., `px`) if provided.
  - Uses a monospaced font for readability.
- **Example**:
  ```jsx
  <NumberField id="gap-input" label="Gap" value={gap} onChange={setGap} min={0} max={64} suffix="px" />
  ```

### **6. Select**
A dropdown menu for selecting one option from a list.
- **Props**:
  - `label`, `value`, `onChange`, `id`: Standard input props.
  - `options`: Array of objects with `value` and `label`.
- **Features**:
  - Styled with focus and hover effects.
  - Includes ARIA attributes for accessibility.
- **Example**:
  ```jsx
  <Select
    id="justify-content-select"
    label="Justify Content"
    value={justifyContent}
    onChange={setJustifyContent}
    options={[{ label: 'Start', value: 'flex-start' }, { label: 'Center', value: 'center' }]}
  />
  ```

### **7. CodeBlock**
Displays generated HTML, CSS, and Tailwind HTML code with copy and export options.
- **Props**:
  - `htmlCode`: Generated HTML code.
  - `cssCode`: Generated CSS code.
  - `tailwindHtml`: Generated Tailwind HTML code.
  - `onExportCodePen`, `onExportJSFiddle`, `onDownloadZip`: Callbacks for exporting code.
- **Features**:
  - Displays code in styled `pre`/`code` blocks.
  - Supports copying individual code blocks or combined HTML+CSS.
  - Shows a "Copied!" confirmation with a checkmark.
  - Exports to CodePen, JSFiddle, or as a ZIP file (using JSZip).
- **Internal Component**:
  - `CodePanel`: Renders a single code block with a title, icon, and copy button.
- **Example**:
  ```jsx
  <CodeBlock
    htmlCode={htmlCode}
    cssCode={cssCode}
    tailwindHtml={tailwindHtml}
    onExportCodePen={exportToCodePen}
    onExportJSFiddle={exportToJSFiddle}
    onDownloadZip={downloadZip}
  />
  ```

### **8. Css-Labs**
The main application component that orchestrates the UI and logic.
- **State**:
  - **Core**: `display` (flex/grid/block), `items` (number of boxes).
  - **Gaps**: `gap` (flex), `rowGap`, `colGap` (grid).
  - **Flexbox**: `flexDirection`, `flexWrap`, `justifyContent`, `alignItems`, `alignContentFlex`.
  - **Grid**: `gridCols`, `gridAutoRows`, `alignContentGrid`, `justifyContentGrid`, `gridAlignItems`, `gridJustifyItems`, `gridColMode`, `gridMinCol`.
  - **Grid Spans**: `spanColValue`, `spanRowValue`, `spanColIndices`, `spanRowIndices`, `usePerItemSpans`, `itemSpans`.
  - **Box Styling**: `boxMinW`, `boxMinH`, `borderRadius`, `shadow`, `showIndex`.
  - **Background**: `bgMode` (fixed/random/gradient), `bgFixed`, `bgGrad1`, `bgGrad2`, `bgAngle`.
  - **Preview**: `viewport` (auto/iphone/tablet/desktop).
  - **History**: `history`, `histIndex` for undo/redo.
  - **Modal**: `open`, `tab` for settings modal.
  - **Import/Export**: `fileInputRef` for importing JSON configs.
  - **Errors**: `spanColError`, `spanRowError` for invalid grid span indices.
- **Key Functions**:
  - `getState`: Returns the current state as an object.
  - `applyState`: Applies a state object to update all state variables.
  - `undo`/`redo`: Navigate the history stack.
  - `parseIndices`: Parses comma-separated indices for grid spans, validating against `items`.
  - `colorForIndex`: Generates HSL colors for random background mode.
  - `backgroundForIndex`: Determines box background based on `bgMode`.
  - `exportToCodePen`/`exportToJSFiddle`: Submits code to external platforms via form submission.
  - `downloadZip`: Generates a ZIP file with HTML and CSS using JSZip.
  - `exportConfig`/`importConfig`: Saves/loads state as JSON.
- **Memoized Values**:
  - `tips`: Generates context-aware tips (e.g., for flex wrap or grid alignment).
  - `containerStyle`: CSS styles for the preview container.
  - `viewportWidth`: Width for the preview viewport.
  - `boxBaseStyle`: Base styles for boxes (min-width, min-height, etc.).
  - `htmlCode`: Generated HTML code for the layout.
  - `cssCode`: Generated CSS code for the layout.
  - `tailwindHtml`: Generated Tailwind HTML code.
  - `spanColSet`/`spanRowSet`: Sets of indices for grid spans.
- **Effects**:
  - Loads initial state from `localStorage`.
  - Persists state to `localStorage` and updates history.
  - Syncs `itemSpans` with `items` count.
  - Resets Flexbox properties when switching to Grid.
  - Handles modal focus and Escape key to close.
- **UI Structure**:
  - **Header**: Title, settings button, undo/redo buttons.
  - **Main Content** (Grid layout):
    - **Live Preview** (8 columns): Viewport toggle, preview container, and optional tip.
    - **Generated Code** (8 columns): Code blocks with copy/export options.
    - **Quick Controls** (4 columns): Display mode, items count, gaps, and basic flex/grid controls.
  - **Footer**: Credits and open-source notice.
  - **Settings Modal**: Tabs for Presets, Display, Common, Flex, Grid, Spans, Box Styling, Responsive, and Tips.

---

## **How It Works**
1. **Initialization**:
   - The app loads any saved configuration from `localStorage` using the `STORAGE_KEY`.
   - Custom slider styles are injected into the document head.
2. **State Management**:
   - Uses React hooks (`useState`, `useMemo`, `useEffect`, `useRef`) to manage state and optimize performance.
   - State is persisted to `localStorage` and tracked in a history stack for undo/redo.
3. **Live Preview**:
   - The preview container applies styles based on `containerStyle` and `boxBaseStyle`.
   - Boxes are rendered dynamically based on `items`, with optional spans and backgrounds.
   - Viewport size is controlled by `viewportWidth`.
4. **Code Generation**:
   - `htmlCode`: Generates HTML for the container and boxes.
   - `cssCode`: Generates CSS for the layout and box styles, including spans.
   - `tailwindHtml`: Generates equivalent Tailwind CSS classes.
5. **Settings Modal**:
   - Organized into tabs for different configuration categories.
   - Supports presets, detailed flex/grid controls, and import/export.
6. **Exporting**:
   - CodePen/JSFiddle: Submits code via hidden forms.
   - ZIP: Uses JSZip to create a downloadable archive.
   - Config: Exports/imports state as JSON.
7. **Accessibility**:
   - Includes ARIA attributes, focus management, and a skip link.
   - Ensures modals are accessible with keyboard navigation.

---

## **Usage**
1. **Open the App**:
   - Render the app in a DOM element with ID `root`.
   - Requires Bootstrap CSS and an internet connection for JSZip (ZIP export).
2. **Configure Layout**:
   - Use the Quick Controls sidebar for basic settings (e.g., display mode, number of items).
   - Open the Settings modal for advanced options (e.g., flex/grid properties, spans, styling).
3. **Preview**:
   - Changes update the live preview instantly.
   - Toggle viewport sizes to test responsiveness.
4. **Export Code**:
   - Copy HTML, CSS, or Tailwind HTML.
   - Export to CodePen/JSFiddle or download as a ZIP.
   - Save/load configurations as JSON.
5. **Undo/Redo**:
   - Use buttons in the header or modal to navigate history.

---

## **Dependencies**
- **React**: For building the UI and managing state.
- **React DOM**: For rendering the app (`createRoot`).
- **Bootstrap CSS**: Provides baseline styling (e.g., grid system, buttons).
- **JSZip** (optional): Loaded dynamically for ZIP exports.
- **SVG Icons**: Custom icons for UI elements (e.g., `CopyIcon`, `LayoutIcon`).

---

## **Limitations**
1. **Grid Columns**: Limited to 12 for fixed mode; `auto-fit`/`auto-fill` requires manual min-width.
2. **History**: Stores up to 50 states, older states are discarded.
3. **Export**: ZIP export requires an internet connection to load JSZip.
4. **Accessibility**: While ARIA attributes are included, further testing may be needed for full compliance.
5. **Browser Support**: Custom slider styles use `-webkit-` and `-moz-` prefixes, which may not cover all browsers.

---

## **Potential Improvements**
1. **Add More Presets**: Include additional layout examples (e.g., masonry, holy grail).
2. **Enhanced Accessibility**: Add more ARIA roles and keyboard shortcuts.
3. **Live Code Editing**: Allow users to edit generated code directly in the UI.
4. **Theming**: Support light/dark modes or custom themes.
5. **Validation**: Add more robust validation for inputs (e.g., negative values).
6. **Offline Support**: Bundle JSZip or cache it for offline ZIP exports.

---

## **Example Usage**
```jsx
// Render the app
const root = createRoot(document.getElementById('root'));
root.render(<DisplayLab />);

// Example preset: Grid with 3 columns
applyState({
  display: 'grid',
  items: 9,
  gridColMode: 'fixed',
  gridCols: 3,
  gridAutoRows: 120,
  rowGap: 12,
  colGap: 12,
});
```

---

This documentation provides a comprehensive overview of the code's structure, functionality, and usage. Let me know if you need further clarification or assistance with specific parts!
