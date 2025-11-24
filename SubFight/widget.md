# SubFight Widget

A voting battle widget where two options compete for points from chat events. Users can start battles using the `!vs` command and watch as different options accumulate points from subs, cheers, tips, and other events.

## Features

- **Voting Battle System**: Two options compete for points from chat events
- **Connected Progress Bars**: Single horizontal bar with two colored segments and SE logo overlay
- **Time-based Rounds**: Each option gets a set time period to accumulate votes
- **Full Screen Overlay**: Top-aligned widget that covers the full screen width
- **Chat Command Control**: Multiple commands for battle management
- **Event-to-Points Conversion**: Convert subs, cheers, tips, etc. to points instead of time
- **Results Display**: Show winner with final scores after battle ends
- **Auto-hide When Inactive**: Widget is invisible when no battle is active
- **Editor Mode Support**: Helper text and demo button visible only in editor mode
- **Customizable Visuals**: Configurable colors, typography, and bar styling
- **Permission System**: Control who can start battles using existing permission settings
- **State Persistence**: Battle state persists across widget reloads

## Commands

### Battle Commands
- **`!vs [seconds];[option A];[option B]`** - Start a new battle
  - Example: `!vs 60;Pizza;Burgers`
  - First round: Only "Pizza" accumulates points
  - Second round: Only "Burgers" accumulates points
  - Results: Shows winner with final scores

### Management Commands
- **`!vs reset`** - Reset to initial state and hide widget
  - Works anytime, regardless of current battle state
  - Immediately hides the widget and clears all data

- **`!vs end`** - End current battle early and show results
  - Only works during active rounds (round_A or round_B)
  - Shows results immediately and auto-hides after 10 seconds

## Usage Flow

1. **Start Battle**: Type `!vs 60;Pizza;Burgers` in chat
2. **Round 1**: First 60 seconds - only "Pizza" accumulates points from events
3. **Round 2**: Next 60 seconds - only "Burgers" accumulates points from events
4. **Results**: Displays "Pizza won with 600 points, Burgers had 230"
5. **Auto-hide**: Widget automatically hides after 10 seconds

## Visual Design

- **Connected Bar**: Single horizontal bar with two colored segments
- **SE Logo**: StreamElements logo in the center overlay
- **Side-aligned Numbers**: Points displayed on left and right sides of bars
- **Timer**: Countdown timer positioned below the connected bar
- **Side-aligned Labels**: Option names aligned to left and right sides
- **Top-aligned Layout**: Widget positioned at the top of the screen

## Configuration

### Points Settings
- **Follower Points**: Points per follower event
- **Sub Points**: Points per subscription tier (T1, T2, T3)
- **Cheer Points**: Points per 100 bits
- **Tip Points**: Points multiplied by tip amount
- **Merch Points**: Points multiplied by merch order amount
- **Purchase Points**: Points multiplied by purchase amount
- **Raid Points**: Points per viewer from raid

### Visual Settings
- **Option A Bar Color**: Color for the left bar segment
- **Option B Bar Color**: Color for the right bar segment
- **Bar Background Color**: Background color for the bar container
- **Bar Height**: Height of the progress bars in pixels
- **Typography**: Font name, size, weight, color, and stroke settings
- **Text Alignment**: Left, center, or right alignment

### Permission Settings
- **Who Can Start Battles**: Streamer only or Mods
- **Additional Users**: Comma-separated list of additional authorized users
- **Battle Command**: Customizable command prefix (default: `!vs`)

### Demo Features
- **Demo Battle**: "Pineapple on pizza" vs "Ketchup on pizza" (30 seconds)

## Battle States

- **Idle**: No battle active, widget hidden
- **Round A**: First option accumulating points
- **Round B**: Second option accumulating points  
- **Results**: Showing winner and final scores

## Event Types Supported

- **Followers**: New follower events
- **Subscriptions**: T1, T2, T3 subscriptions (with gift sub filtering)
- **Cheers**: Bits donations (with minimum threshold)
- **Tips**: Streamlabs tips (with minimum threshold)
- **Merch**: Merchandise purchases
- **Purchases**: Third-party purchases
- **Raids**: Incoming raids (with minimum viewer threshold)

## Technical Features

- **State Persistence**: Uses SE_API.store to maintain battle state across reloads
- **Permission Checking**: Validates user permissions before executing commands
- **Battle Protection**: Prevents new battles from starting when one is already active
- **Error Handling**: Graceful handling of invalid commands and edge cases
- **Console Logging**: Detailed logging for debugging and monitoring
