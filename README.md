# Minimal Roots: Family Tree Builder 🌳

A minimalist, high-resolution family tree builder optimized for perfect A3 and A4 physical printing.

Most family tree generators are bloated with ads, lock basic features behind paywalls, or fail completely when trying to format a large tree for a standard home printer. This project solves that by utilizing a strict black-and-white aesthetic, an automated orthogonal layout engine, and a high-resolution canvas exporter guaranteed to fit perfectly on standard A3 and A4 paper without cutting off any branches.

## 🚀 Quick Start

### 1. Installation Commands

```bash
# Navigate to the project directory
cd FTB

# Install all dependencies
npm install

# Start the development server
npm run dev
```

The app will open at `http://localhost:51732`.

### 2. Project Structure

```
FTB/
├── src/
│   ├── components/
│   │   ├── FamilyTreeCanvas.jsx    # Main canvas, UI panels, and image export
│   │   ├── CustomNode.jsx          # Individual family member node layout
│   │   ├── ContextMenu.jsx         # Relation type dropdown menu
│   │   └── DataModal.jsx           # Data entry form
│   ├── utils/
│   │   ├── layoutEngine.js         # Dagre auto-layout logic & spouse routing
│   │   └── constants.js            # Paper sizes and dagre configuration
│   ├── App.jsx                     # Root component
│   ├── App.css                     # All application styling
│   └── main.jsx                    # React entry point
├── package.json
└── vite.config.js
```

## 📖 How to Use

### Step 1: Start Building
- Launch the app to see an empty, framed canvas.
- Click the **"+ Add First Person"** button in the center.
- Enter the root person's details in the modal and save.

### Step 2: Add Family Members
- Select any existing node on the canvas (it will highlight with a thicker border).
- Look at the **Action Panel** on the left side of the screen and click **"➕ Add Relation"**.
- A dropdown menu will appear right next to your selected node. Choose a relation type:
  - **Add Parent** (routes upward)
  - **Add Spouse** (connects horizontally with a straight line)
  - **Add Sibling** (routes to the same parent level)
  - **Add Child** (routes downward directly from the selected node)

### Step 3: Enter Details
A modal will appear with three fields:
- **Name** (required) - *Note: You can also double-click any node later to quick-edit the name.*
- **Age / Birth Year** (optional)
- **Status** - Toggle between "Alive" (solid border) and "Deceased" (dashed border)

### Step 4: Manage the Canvas
- **Change Size Mid-Flight**: Use the dropdown in the top toolbar to instantly switch between A4 Portrait/Landscape or A3 Portrait/Landscape.
- **Delete Nodes**: Select any node and click **"🗑️ Delete Selected"** in the left Action Panel.
- **MiniMap**: Use the bottom-right MiniMap to navigate massive family trees.

### Step 5: High-Res Export (Printing)
- Click the **"📸 Download Image"** button in the toolbar.
- The app will filter out all UI buttons and generate a pixel-perfect, 3x-resolution PNG of your tree.
- Open the downloaded PNG, hit `Ctrl + P`, and select "Fit to Page" to print flawlessly on your physical paper.

## 🎨 Design Specifications

### Typography
- **Node Names**: 16px (12pt when printed at 100% scale)
- **Age/Status**: 13px (10pt when printed)
- **Font**: System sans-serif (Inter, SF Pro Display, or Segoe UI)
- **Line Height**: 1.4-1.5 for optimal arm's-length readability

### Node Styling
- **Alive**: Solid 1.5px black border
- **Deceased**: Dashed 1.5px black border
- **Selected**: 2px border with subtle shadow
- **Padding**: 12px internal spacing
- **Size**: 180px × 90px (minimum height)

## 🛠️ Technical Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Component architecture & UI |
| Vite | Fast build tool and dev server |
| ReactFlow | Canvas, dragging, and invisible 4-way node handles |
| Dagre | Automatic graph layout algorithm |
| html-to-image | High-resolution PNG canvas export |

## 📝 Code Architecture

### Data Flow
```
User Click → Action Panel → State Update → layoutEngine.js (Dagre) → Canvas Re-render
```

### Key Logic Solutions
- **The Canvas Print Bug**: Bypassed standard browser printing (which drops SVG lines) in favor of forced, high-density PNG rendering via `html-to-image`.
- **The Spouse Alignment**: dagre natively forces top-down structures. `layoutEngine.js` intercepts spouse nodes, removes them from the vertical calculation, and manually snaps them exactly to the right of their partners.
- **Child Routing**: Children connect exclusively to the specific parent node where the "Add" action originated, ensuring clean mapping for blended families and step-children.

## 🐛 Troubleshooting

### Nodes Overlapping?
If a massively complex branch begins to overlap, increase the `nodesep` (horizontal spacing) or `ranksep` (vertical spacing) values inside `src/utils/constants.js`.

### Cannot Find the Add Button?
The tiny node buttons were removed for better scaling. Click on a node first, and the main Action Panel will appear on the far-left side of your screen.

## 🚀 Future Enhancements

Ideas for extending this project:
- Import/Export family tree data as JSON
- Multiple independent family trees on one canvas
- Relationship labels on connecting lines
- Color coding by family branch

## 📄 License

MIT - Feel free to use, modify, and distribute!