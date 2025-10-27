# Loan Disbursal Simulator

An interactive React-based web application for simulating loan disbursement funnels over time with side-by-side scenario comparison. Built to help analyze and forecast loan performance metrics across different conversion assumptions.

## Features

### Core Functionality
- **Multi-Scenario Analysis**: Support for 2-4 scenarios displayed side-by-side with independent parameters
- **Preset Templates**: Quick start with Optimistic, Conservative, or Custom scenarios
- **Interactive Data Tables**: Excel-like inline editing with real-time calculations
- **Advanced Calculations**: Automatic computation of:
  - Total new loans from download funnel
  - Disbursals from new users
  - Cumulative user tracking
  - Repeat disbursals based on previous users
  - Total disbursals (new + repeat)

### Global Parameters
- Average Ticket Size (New Users)
- Repeat Ticket Size
- Repeat Conversion Rate
- Number of Months (configurable 1-60)

### Input Metrics (Per Month)
- Downloads
- Loan Page Conversion %
- Underwriting Pass Rate %
- Disbursal Rate %
- Conversion Rate %

### Visualizations
- **Stacked Bar Charts**: Monthly new vs repeat disbursals per scenario
- **Line Graphs**: Cumulative user growth across all scenarios
- **Summary Cards**: Total disbursals, final users, average monthly disbursal
- **Funnel Visualization**: Aggregate conversion funnel across all months

### Data Management
- **CSV Import/Export**: Full data portability
- **PDF Reports**: Professional export with formulas and summaries
- **LocalStorage Persistence**: Auto-save scenarios between sessions
- **Undo/Redo**: Full editing history support
- **Scenario Operations**: Add, delete, duplicate, and reset scenarios

### User Experience
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Desktop-first with mobile accordion fallback
- **Input Validation**: Real-time validation with visual feedback
- **Tooltips**: Formula explanations on calculated cells
- **Sticky Headers**: Easy navigation through long tables
- **Color Coding**: Visual distinction between input and calculated fields

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: Zustand with persistence middleware
- **Charts**: Recharts
- **Data Processing**: PapaParse (CSV), jsPDF (PDF export)
- **Icons**: Lucide React

## Installation

```bash
# Clone the repository
git clone https://github.com/shikhar127/Disbursal-Simulator.git
cd Disbursal-Simulator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Select or Create a Scenario**: Choose from preset scenarios or create custom ones
2. **Configure Global Parameters**: Set ticket sizes, conversion rates, and timeframe
3. **Edit Monthly Data**: Click cells to edit downloads and conversion rates
4. **Review Calculations**: All metrics update automatically in real-time
5. **Analyze Visualizations**: Compare scenarios using charts and graphs
6. **Export Results**: Download CSV data or PDF reports

## Calculation Formulas

### Total New Loans
```
Total New Loans = Downloads × Loan Page % × Underwriting % × Disbursal %
```

### Disbursal from New (Crores)
```
Disbursal from New = (Total New Loans × Avg Ticket Size) / 10,000,000
```

### Cumulative New Users
```
Cumulative New Users = Running sum of Total New Loans from Month 1 to current month
```

### Repeat Disbursal (Crores)
```
Month 1: 0
Month N: (Previous Month's Cumulative Users × Repeat Conversion Rate × Repeat Ticket Size) / 10,000,000
```

### Total Disbursal
```
Total = Disbursal from New + Repeat Disbursal
```

## Project Structure

```
src/
├── components/
│   ├── Charts.tsx           # Visualization components
│   ├── DataTable.tsx        # Interactive editable table
│   ├── GlobalParams.tsx     # Global parameter inputs
│   ├── ScenarioManager.tsx  # Scenario CRUD and exports
│   └── SummaryCards.tsx     # Metric summary cards
├── store/
│   └── useStore.ts          # Zustand state management
├── utils/
│   ├── calculations.ts      # Calculation logic
│   └── cn.ts                # Tailwind utility
├── types.ts                 # TypeScript interfaces
├── App.tsx                  # Main application
└── main.tsx                 # Entry point
```

## Development

### Key Concepts

**State Management**: The app uses Zustand for centralized state with localStorage persistence. All scenario data, history, and preferences are automatically saved.

**Real-time Calculations**: Updates are triggered on any input change, recalculating all dependent fields using the formulas defined in `utils/calculations.ts`.

**Type Safety**: Full TypeScript coverage ensures data integrity and catches errors at compile time.

### Adding New Features

1. Update types in `src/types.ts`
2. Modify calculation logic in `src/utils/calculations.ts`
3. Update Zustand store actions in `src/store/useStore.ts`
4. Add UI components as needed

## License

MIT

## Author

Built with React, TypeScript, and modern web technologies.

---

**Note**: All calculations are performed client-side. No data is sent to external servers. All scenario data is stored locally in your browser.
