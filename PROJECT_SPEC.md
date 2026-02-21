# GTO Poker Trainer - Project Specification

## Project Overview
A web-based poker training application focused on 6-max No Limit Hold'em cash games, providing GTO (Game Theory Optimal) feedback on player decisions throughout complete poker hands.

**Goal**: Create a free alternative to GTO Wizard's trainer feature with full hand playthrough capabilities and detailed decision feedback.

**Timeline**: 1-2 months for polished MVP

---

## Core Features

### 1. Hand Playthrough (Preflop to River)
- Full hand simulation from preflop through showdown
- Decision points at each street: preflop, flop, turn, river
- Multiple action options at each decision point (fold, check, call, bet, raise with sizes)
- Opponent actions simulated using GTO frequencies

### 2. Immediate Decision Feedback
- **Frequency Display**: Show GTO frequency for chosen action vs alternatives
- **EV Comparison**: Display expected value for all available actions
- **Visual Indicators**:
  - Best action (highest frequency)
  - Correct actions (positive EV or within acceptable range)
  - Blunders (significantly negative EV)

### 3. End-of-Hand Review
- Summary screen showing all decision points
- Clear visualization of:
  - Each decision made (preflop, flop, turn, river)
  - GTO frequency for each decision
  - Blunders highlighted in red
  - Correct decisions with alternative options shown
- Score/performance metric for the hand

### 4. Info Panel (Ranges & Strategy)
- **Range Tab**:
  - Player's current range
  - Opponent's range
  - Range composition (hand classes, draws, made hands)
- **Strategy Tab**:
  - GTO strategy for current spot
  - Frequency breakdown by action type
  - Hand class recommendations

### 5. Multiple Difficulty Modes
- **Standard Mode**: Choose exact bet/raise sizes (e.g., 33% pot, 66% pot, 125% pot)
- **Grouped Mode**: Select action categories (small bet, medium bet, large bet, overbet)
- **Simple Mode**: Basic actions only (bet/raise, check/call, fold)

### 6. Progress Tracking (Local Storage)
- Session statistics
- Performance over time
- Common mistake tracking
- Designed to easily migrate to user accounts later

---

## Technical Architecture

### Tech Stack
- **Frontend**: React 18+ with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB (for GTO solutions) + PostgreSQL option
- **State Management**: React Context API or Redux Toolkit
- **Styling**: Tailwind CSS or Material-UI
- **Build Tool**: Vite
- **Card Rendering**: Custom SVG components or poker-cards library

### Architecture Pattern
```
┌─────────────────────────────────────────┐
│         React Frontend (SPA)            │
│  ┌───────────────────────────────────┐  │
│  │  Trainer UI Components            │  │
│  │  - Hand Display                   │  │
│  │  - Action Buttons                 │  │
│  │  - Info Panel                     │  │
│  │  - Review Screen                  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Game State Management            │  │
│  │  - Current hand state             │  │
│  │  - Decision history               │  │
│  │  - User progress (local storage)  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    │
                    │ REST API
                    ▼
┌─────────────────────────────────────────┐
│         Node.js Backend API             │
│  ┌───────────────────────────────────┐  │
│  │  Poker Game Engine                │  │
│  │  - Hand evaluation                │  │
│  │  - Action validation              │  │
│  │  - Pot calculation                │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  GTO Solution Service             │  │
│  │  - Fetch GTO strategies           │  │
│  │  - Calculate EV                   │  │
│  │  - Score decisions                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Database Layer                  │
│  ┌───────────────────────────────────┐  │
│  │  GTO Solutions Database           │  │
│  │  - Preflop ranges                 │  │
│  │  - Postflop strategies            │  │
│  │  - Board textures                 │  │
│  │  - Action frequencies             │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## GTO Data Strategy

### Initial Approach: Pre-Generated Solutions Database

**Phase 1: Limited Scenario Set (MVP)**
- Focus on 50-100 most common 6-max spots
- Categories:
  1. **Preflop**: Standard opens, 3bets, 4bets from all positions
  2. **Postflop**: Common board textures (dry, wet, paired, etc.)
  3. **Stack Depths**: 100bb, 50bb, 30bb
  4. **Betting Streets**: Single raised pot (SRP), 3bet pot, 4bet pot

**Data Sources (Open Source Options):**

1. **TexasSolver** (Primary Choice)
   - Fast, open-source C++ solver
   - JSON export capability
   - Free for personal use
   - Use to generate custom solutions

2. **sol5000/gto** (Secondary)
   - Python-based with preflop strategy packs
   - Pre-built common solutions
   - Monte Carlo equity simulations

3. **wasm-postflop**
   - Web-based solver
   - Could potentially integrate for on-demand solving
   - Development suspended but functional

**Data Generation Workflow:**
```
1. Define scenario parameters (positions, stack depth, board)
2. Run TexasSolver to generate GTO solution
3. Export to JSON format
4. Parse and store in database with schema:
   - Scenario ID
   - Game state (positions, stacks, board, pot)
   - Available actions with frequencies and EV
   - Range information
5. Create API endpoints to fetch solutions
```

### Database Schema (Preliminary)

```javascript
// Scenario Collection
{
  _id: ObjectId,
  scenarioType: "preflop" | "flop" | "turn" | "river",
  gameFormat: "6max-cash",
  positions: {
    hero: "BTN",
    villain: "CO"
  },
  stackDepth: 100, // in BB
  pot: 3.5, // in BB
  board: ["Ah", "Kd", "7s"], // empty for preflop
  actionHistory: ["CO raises 2.5bb", "BTN calls"],

  // GTO Solution
  solution: {
    actions: [
      {
        action: "bet",
        size: "33% pot",
        frequency: 0.45,
        ev: 12.5,
        hands: ["AA", "KK", "AK", ...] // range for this action
      },
      {
        action: "check",
        frequency: 0.55,
        ev: 11.2,
        hands: ["QQ", "JJ", ...]
      }
    ],
    ranges: {
      hero: { /* range composition */ },
      villain: { /* range composition */ }
    }
  }
}

// User Progress (Local Storage initially)
{
  sessionId: uuid,
  handsPlayed: 45,
  accuracy: 0.72,
  blunderCount: 8,
  decisionHistory: [
    {
      handId: uuid,
      scenario: scenarioId,
      decisions: [
        {
          street: "flop",
          heroAction: "bet 50% pot",
          gtoFrequency: 0.35,
          ev: 10.2,
          isBlunder: false,
          timestamp: Date
        }
      ]
    }
  ]
}
```

---

## User Interface Design

### Main Trainer Screen

```
┌──────────────────────────────────────────────────────────────────┐
│  GTO Poker Trainer                                    [Settings] │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  POT: 7.5bb                           STACKS: Hero: 97bb  │
│                                              Villain: 100bb│
│                                                                   │
│            ┌─────────────────────┐                                │
│            │   Villain (CO)      │                                │
│            │      ? ?            │                                │
│            │    [ACTION]         │                                │
│            └─────────────────────┘                                │
│                                                                   │
│              ╔════════════════╗                                   │
│              ║   BOARD        ║                                   │
│              ║   A♥ K♦ 7♠     ║                                   │
│              ╚════════════════╝                                   │
│                                                                   │
│            ┌─────────────────────┐                                │
│            │   Hero (BTN)        │                                │
│            │    A♠ Q♠            │                                │
│            └─────────────────────┘                                │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Your Action:                                             │   │
│  │  [FOLD]  [CHECK]  [BET 33%]  [BET 50%]  [BET 75%]        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
│                      INFO PANEL                                   │
├──────────────────────────────────────────────────────────────────┤
│  [Range] [Strategy]                                               │
│                                                                   │
│  Current Spot: BTN vs CO Single Raised Pot on A♥K♦7♠             │
│                                                                   │
│  GTO Strategy:                                                    │
│  ✓ Check: 55.2% (EV: 11.3bb)                                     │
│  ✓ Bet 33%: 44.8% (EV: 12.1bb)  ← Best action                   │
│                                                                   │
│  With your hand (A♠Q♠):                                           │
│  - Top pair, good kicker                                          │
│  - You should bet 33% 70% of the time                            │
│  - You should check 30% of the time                              │
└──────────────────────────────────────────────────────────────────┘
```

### End-of-Hand Review Screen

```
┌──────────────────────────────────────────────────────────────────┐
│  Hand Review - Hand #42                            [Next Hand]   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Final Board: A♥ K♦ 7♠ 3♣ 9♥                                     │
│  Result: Won pot of 18.5bb                                        │
│                                                                   │
│  Your Performance: 85/100 ⭐⭐⭐                                    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PREFLOP                                          ✓       │   │
│  │  You: Raised 2.5bb from BTN with A♠Q♠                    │   │
│  │  GTO: Raise 100% (EV: +2.1bb)                             │   │
│  │  Alternative: Could also raise to 3bb (15% freq)         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FLOP: A♥ K♦ 7♠                                   ✓       │   │
│  │  Villain checked, You bet 33% pot (2.5bb)                 │   │
│  │  GTO: Bet 33% 44.8% (EV: +12.1bb) ← Best                 │   │
│  │  Alternative: Check 55.2% (EV: +11.3bb)                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  TURN: 3♣                                         ⚠️       │   │
│  │  Villain called, You bet 75% pot (7.5bb)                  │   │
│  │  GTO: Check 80% (EV: +15.2bb) ← Best                      │   │
│  │  Your Action: Bet 75% 12% (EV: +13.1bb)  BLUNDER!        │   │
│  │  Analysis: Overbetting with 2nd pair is too aggressive    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  RIVER: 9♥                                        ✓       │   │
│  │  Villain folded                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [View Full Solution] [Practice Similar Spot] [Next Hand]        │
└──────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Set up project structure (React + Node.js + TypeScript)
- [ ] Install and configure development tools
- [ ] Create basic poker game engine
  - Card representation
  - Hand evaluation
  - Pot calculation
  - Action validation
- [ ] Design and implement database schema
- [ ] Set up API endpoints structure

### Phase 2: GTO Data Integration (Week 2-3)
- [ ] Research and select 50-100 common scenarios
- [ ] Install and learn TexasSolver
- [ ] Generate GTO solutions for scenarios
- [ ] Parse solver output to JSON
- [ ] Populate database with solutions
- [ ] Create API endpoints to fetch solutions
- [ ] Implement solution matching algorithm (match game state to scenario)

### Phase 3: Core Trainer Logic (Week 3-4)
- [ ] Implement hand progression system
- [ ] Create decision validation against GTO solution
- [ ] Calculate frequency differences
- [ ] Implement EV calculations
- [ ] Build scoring system
- [ ] Create blunder detection algorithm

### Phase 4: Frontend UI (Week 4-6)
- [ ] Design and build main trainer screen
  - Poker table visualization
  - Card displays (board, hero hand, villain placeholder)
  - Pot and stack displays
  - Action buttons (dynamic based on game state)
- [ ] Build info panel
  - Range display component
  - Strategy breakdown
  - Tabs for Range/Strategy
- [ ] Create immediate feedback display
  - Action frequency comparison
  - EV visualization
  - Best/correct/blunder indicators
- [ ] Build end-of-hand review screen
  - Decision timeline
  - Blunder highlighting
  - Alternative actions display

### Phase 5: Advanced Features (Week 6-7)
- [ ] Implement difficulty modes
  - Standard mode (exact sizes)
  - Grouped mode (small/medium/large)
  - Simple mode (bet/check/fold)
  - Mode selection UI
- [ ] Add local storage for progress tracking
  - Session stats
  - Historical performance
  - Decision patterns
- [ ] Create statistics dashboard
  - Accuracy over time
  - Common mistakes
  - Improvement metrics

### Phase 6: Polish & Testing (Week 7-8)
- [ ] UI/UX refinements
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Bug fixes
- [ ] User testing and feedback
- [ ] Documentation

---

## File Structure

```
poker_trainer/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── trainer/
│   │   │   │   ├── PokerTable.tsx
│   │   │   │   ├── ActionButtons.tsx
│   │   │   │   ├── InfoPanel.tsx
│   │   │   │   ├── HandReview.tsx
│   │   │   │   └── FeedbackDisplay.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Modal.tsx
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       └── Layout.tsx
│   │   ├── contexts/
│   │   │   ├── GameContext.tsx
│   │   │   └── ProgressContext.tsx
│   │   ├── hooks/
│   │   │   ├── usePokerGame.ts
│   │   │   ├── useGTOSolution.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── localStorage.ts
│   │   ├── types/
│   │   │   ├── poker.ts
│   │   │   ├── gto.ts
│   │   │   └── game.ts
│   │   ├── utils/
│   │   │   ├── cardUtils.ts
│   │   │   ├── handEvaluator.ts
│   │   │   └── formatters.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── scenarios.ts
│   │   │   ├── solutions.ts
│   │   │   └── game.ts
│   │   ├── services/
│   │   │   ├── gtoService.ts
│   │   │   ├── pokerEngine.ts
│   │   │   └── scoringService.ts
│   │   ├── models/
│   │   │   ├── Scenario.ts
│   │   │   └── Solution.ts
│   │   ├── utils/
│   │   │   ├── handEvaluator.ts
│   │   │   ├── potCalculator.ts
│   │   │   └── validators.ts
│   │   ├── middleware/
│   │   │   └── errorHandler.ts
│   │   ├── config/
│   │   │   └── database.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── data/                      # GTO solutions data
│   ├── scenarios/
│   │   ├── preflop/
│   │   ├── flop/
│   │   ├── turn/
│   │   └── river/
│   └── ranges/
│       └── preflop-ranges.json
│
├── scripts/                   # Utility scripts
│   ├── generateScenarios.ts  # Generate scenarios for solving
│   ├── importSolutions.ts    # Import TexasSolver output
│   └── populateDb.ts         # Seed database
│
├── docs/
│   ├── API.md
│   ├── SCENARIOS.md          # List of implemented scenarios
│   └── GTO_DATA.md           # GTO data sources and format
│
├── PROJECT_SPEC.md           # This file
├── README.md
└── package.json
```

---

## Key Technical Challenges & Solutions

### 1. Challenge: Matching Game States to GTO Solutions
**Problem**: Need to match current hand state to pre-solved scenario in database

**Solution**:
- Normalize board texture (suits don't matter for isomorphic boards)
- Categorize scenarios by key parameters:
  - Street (preflop/flop/turn/river)
  - Pot type (SRP/3bet/4bet)
  - Position matchup
  - Stack depth buckets
  - Action history pattern
- Use indexing and board texture normalization

### 2. Challenge: Range Visualization
**Problem**: Displaying ranges in an intuitive way

**Solution**:
- Use grid layout for all 169 hand combinations
- Color-code by frequency (heat map)
- Group by hand class (pairs, suited, offsuit)
- Show simplified percentages for MVP

### 3. Challenge: Opponent Action Simulation
**Problem**: Opponents need to act according to GTO frequencies

**Solution**:
- Fetch GTO solution for opponent's spot
- Use weighted random selection based on frequencies
- Ensure realistic distribution over many hands

### 4. Challenge: Fast Solution Lookup
**Problem**: Need instant feedback without lag

**Solution**:
- Pre-compute and store all solutions in database
- Index by game state parameters
- Cache frequently accessed solutions in memory
- Optimize API response time

---

## MVP Feature Priority

### Must Have (Core MVP)
1. ✅ Basic hand playthrough (preflop to river)
2. ✅ Decision feedback with frequencies
3. ✅ End-of-hand review with blunders highlighted
4. ✅ 30-50 common scenarios pre-loaded
5. ✅ Simple UI showing board, cards, actions

### Should Have (Polished MVP)
6. ✅ Info panel with GTO strategy
7. ✅ Multiple difficulty modes
8. ✅ Local progress tracking
9. ✅ 100+ scenarios
10. ✅ Professional UI/UX

### Nice to Have (Post-MVP)
11. ⏳ User accounts and authentication
12. ⏳ Custom scenario builder
13. ⏳ RNG mode for mixed strategies
14. ⏳ Timer/timebank feature
15. ⏳ Multiple table simulation
16. ⏳ Detailed statistics and analytics
17. ⏳ Tournament (MTT) scenarios
18. ⏳ Other game formats (Heads-up, 9-max)

---

## Next Steps

1. **Validate Approach**: Review this spec and confirm all features align with your vision

2. **Set Up Development Environment**:
   - Initialize React + Vite project
   - Set up Node.js/Express backend
   - Configure TypeScript
   - Set up MongoDB

3. **Prototype GTO Data Pipeline**:
   - Install TexasSolver
   - Generate 5-10 test scenarios
   - Parse output and store in database
   - Test solution retrieval

4. **Build Basic Poker Engine**:
   - Hand evaluation
   - Game state management
   - Action validation

5. **Create Minimal UI**:
   - Display cards and board
   - Action buttons
   - Basic feedback display

6. **Iterate and Expand**:
   - Add more scenarios
   - Enhance UI
   - Add features from priority list

---

## Questions for Clarification

Before starting implementation, please confirm:

1. **GTO Data Licensing**: Are you comfortable using TexasSolver (free for personal use) to generate solutions? Or would you prefer to find pre-existing open datasets?

2. **Database Preference**: MongoDB vs PostgreSQL for storing solutions?

3. **Hosting Plans**: Where do you plan to host this (Vercel, Netlify, AWS, local)?

4. **Design Style**: Do you have a preference for the visual style? (Dark theme like GTO Wizard, minimalist, colorful, etc.)

5. **Scenario Selection**: Should I research and provide a specific list of the 50-100 scenarios to start with?

6. **Development Approach**: Would you like to pair program this, or should I build sections independently for your review?

---

## Resources

### GTO Solvers (Open Source)
- [TexasSolver](https://github.com/bupticybee/TexasSolver) - Fast C++ solver
- [wasm-postflop](https://wasm-postflop.pages.dev/) - Web-based solver
- [sol5000/gto](https://github.com/sol5000/gto) - Python poker tool

### Poker Libraries
- [pokersolver](https://github.com/goldfire/pokersolver) - JavaScript hand evaluator
- [pokerkit](https://github.com/uoftcprg/pokerkit) - Python poker game simulation
- [poker-odds](https://www.npmjs.com/package/poker-odds) - Calculate equity

### Learning Resources
- [GTO Wizard Blog](https://blog.gtowizard.com/) - Strategy articles
- [GTO Wizard Help](https://help.gtowizard.com/) - Feature documentation

---

**Ready to start building?** Let me know if you'd like to proceed with the implementation or if you have any adjustments to this specification!
