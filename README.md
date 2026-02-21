# GTO Poker Trainer

A web-based poker training application for learning Game Theory Optimal (GTO) strategy in 6-max No Limit Hold'em cash games.

## 🎯 Project Goal

Create a free alternative to GTO Wizard's trainer feature with:
- Full hand playthrough from preflop to river
- GTO feedback on every decision
- Detailed end-of-hand review showing blunders
- Info panel with ranges and strategy breakdown

## 🚀 Quick Start

### Prerequisites

✅ You already have these installed:
- **Node.js** v22.20.0
- **npm** 10.9.3
- **git** 2.51.1

### Installation

```bash
# Clone the repository (you've already done this!)
git clone git@github.com:kdlin/poker_trainer.git
cd poker_trainer

# We'll install dependencies as we build each part
```

## 📁 Project Structure

We're building this **incrementally** (one piece at a time) to make learning easier:

```
poker_trainer/
├── PROJECT_SPEC.md        # Detailed technical specification
├── README.md              # This file - setup and usage guide
├── client/                # React frontend (we'll create this next)
└── data/                  # GTO solutions in JSON format (added later)
```

## 🛠️ Development Approach

### Phase 1: Frontend Foundation (Current)
1. ✅ Create project specification
2. ✅ Set up README
3. ⏳ Initialize React app with Vite + TypeScript
4. ⏳ Install Material UI for components
5. ⏳ Build basic poker table UI

### Phase 2: Game Logic
- Hand evaluation
- Game state management
- Action validation

### Phase 3: GTO Integration
- Create sample GTO scenarios (JSON)
- Match game states to solutions
- Calculate decision feedback

### Phase 4: Review & Feedback
- End-of-hand review screen
- Blunder detection
- Performance tracking

## 🎓 Learning Resources

As we build, you'll learn:

### React Concepts
- **Components**: Reusable UI pieces (like poker cards, buttons)
- **Props**: Passing data between components
- **State**: Managing changing data (like current hand, pot size)
- **Hooks**: Functions like `useState`, `useEffect` for managing state

### TypeScript Benefits
- **Type safety**: Catch errors before running code
- **Autocomplete**: Better editor support
- **Documentation**: Types serve as inline documentation

### Project Structure
- **Separation of concerns**: UI vs logic vs data
- **Component-based architecture**: Build small, reusable pieces
- **State management**: Keep track of game state

## 🃏 Poker Terminology

Quick reference for GTO concepts we'll implement:

- **GTO (Game Theory Optimal)**: Unexploitable poker strategy
- **Frequency**: How often to take each action (e.g., bet 60%, check 40%)
- **EV (Expected Value)**: Average profit/loss for a decision
- **Blunder**: A decision significantly worse than GTO
- **Range**: All possible hands a player could have
- **Street**: Betting round (preflop, flop, turn, river)

## 📊 Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Material UI (MUI)
- **Styling**: MUI's built-in styling + custom CSS
- **Data Storage**: JSON files (initially) → MongoDB (later)
- **GTO Solutions**: TexasSolver (we'll set this up together)

## 🎮 Planned Features

### Core Features (MVP)
- [x] Project specification
- [ ] Hand playthrough (preflop → river)
- [ ] End-of-hand review with all decisions
- [ ] GTO frequency feedback
- [ ] Blunder highlighting
- [ ] Info panel (hidden by default, toggle to show)

### Difficulty Modes
- [ ] Standard: Exact bet sizes (33%, 66%, 125%)
- [ ] Grouped: Small/medium/large bets
- [ ] Simple: Just bet/check/fold

### Progress Tracking
- [ ] Session statistics
- [ ] Performance over time
- [ ] Common mistake tracking

## 📝 Development Log

### 2026-02-21
- ✅ Created comprehensive project specification
- ✅ Set up git repository and GitHub remote
- ✅ Created README with setup guide
- ⏳ Next: Initialize React frontend

## 🤝 Contributing

This is a learning project! As we build:
- Code will be well-commented to explain concepts
- Each feature will be built incrementally
- Frequent commits to track progress

## 📖 Documentation

- [PROJECT_SPEC.md](PROJECT_SPEC.md) - Full technical specification
- [GTO Wizard Help](https://help.gtowizard.com/) - Reference for features

## 🔗 Resources

- [React Docs](https://react.dev/) - Official React documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Learn TypeScript
- [Material UI](https://mui.com/) - Component library we're using
- [Vite Guide](https://vitejs.dev/guide/) - Fast build tool

---

**Next Step**: Initialize the React frontend with Vite and TypeScript! 🚀
