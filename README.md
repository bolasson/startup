# Nope to Dope  

This application allows players to test how well they know their friends’ opinions on fun and unexpected scales. Nope to Dope is a multiplayer guessing game designed for social interaction and engagement. The app allows up to 8 players per game and tracks scores across rounds. It combines creativity, humor, and real-time collaboration, ensuring an entertaining experience for all participants.

[Check out the app's current progress here!](https://brycelasson.click)

---

## Specification Deliverable  

### Elevator Pitch 🛗  
Have you ever wondered how well you know your friends’ niche opinions? Nope to Dope is the ultimate social guessing game where players compete to match their friends’ opinions on dynamic, creative scales. From scales like "disgusting to delicious" to "old-fashioned to modern", Nope to Dope keeps everyone engaged with fun clues, real-time voting, and friendly competition. Create or join a game, and see how well you know each other!

### Design
The app has three primary views:  
1. **Login Page**: Securely log in or create an account to start playing.  
2. **Game Setup Page**: Create or join a game using a unique code.  
3. **Game Page**: Displays the scale, countdown timer, player sliders, and live scoreboard.  

Mockup images of the Game Page for desktop and mobile are attached below:

#### 💻 Desktop:

![Desktop View 1](desktopView1.png)

#### 📱 Mobile:

![Mobile View](mobileView.png)

Here is a sequence diagram showing interactions between players, the backend, and WebSocket when voting.

```mermaid
sequenceDiagram
    actor PlayerIt as Player (It)
    actor OtherPlayers as Other Players
    participant Browser as Web Browser
    participant Server as Backend Server
    participant DB as Database
    participant WebSocket as WebSocket

    PlayerIt->>Browser: Enter clue and submit
    Browser->>Server: Send clue (HTTP POST)
    Server->>DB: Save clue
    Server->>WebSocket: Broadcast clue to all players

    OtherPlayers->>Browser: Adjust slider to vote
    Browser->>WebSocket: Send slider value (WebSocket message)
    WebSocket->>Server: Update votes in real time
    Server->>Browser: Update slider positions for all players (WebSocket message)

    Browser->>Server: Lock in vote when timer expires
    Server->>DB: Save locked-in votes
    Server->>Server: Calculate scores for all players
    Server->>DB: Store updated scores
    Server->>WebSocket: Broadcast results and scores
    WebSocket->>Browser: Display results and updated scores
```

### Key Features 🔑
- Secure login over HTTPS.  
- Create or join a game with up to 8 players.  
- Unique scales fetched from the database for every round.  
- Real-time slider adjustments visible to all players via WebSocket.  
- Automatic scoring after each round with live leaderboard updates.  
- Content moderation for player-submitted clues using an external API.  
- Persistent storage of game data, including scores and scales used.

### Technologies  

**HTML**  
Provides structure for login, game setup, and gameplay pages with form inputs, dynamic scoreboards, and interactive elements.  

**CSS**  
Ensures responsive design and styling with animations for voting interactions.  

**React**  
Manages state and routing between views with reusable components and real-time updates.  

**Service**  
Backend service with endpoints for:  
- `login`: Authenticates users securely.  
- `fetchScales`: Retrieves unique scales from the database.  
- `submitClue`: Allows the "it" player to submit a clue.  
- `submitVotes`: Processes and stores player votes for scoring.  
- External API: Filters inappropriate clues using a moderation API.  

**Database/Login**  
Stores user accounts, hashed credentials, game data, and tracks used scales for unique rounds.  

**WebSocket**  
Broadcasts real-time slider updates, locked-in results, and live game events to all players.  


## HTML Deliverable

Bryce's comments: I added a Statistics page, but other than that, I stuck to my original plan. Below shows what I implemented.

- [x] **HTML pages** - Four HTML pages were created to represent key components of the application:
  - `index.html`: Home and login page.
  - `create_or_join.html`: Page for creating or joining a game.
  - `play.html`: Gameplay page.
  - `statistics.html`: Statistics page displaying user game data.
- [x] **Links** - Navigation links connect all pages via the `<nav>` menu. Links allow seamless transitions between the home, game setup, gameplay (only accessible by joining or creating a game), and statistics pages.
- [x] **Text** - Informative textual content includes:
  - Game rules and how-to-play guide (`create_or_join.html`).
  - Gameplay details (`play.html`).
  - User statistics (`statistics.html`).
- [x] **Images** - Images such as `logo.png` and `user_black.svg` are used in headers and forms across all pages.
- [x] **DB/Login** - Placeholders for database data are present:
  - Login form with username and password fields in `index.html`.
  - Game-related data like clue scales in `play.html`.
  - Player statistics such as games played and total points in `statistics.html`.
- [x] **WebSocket** - Real-time updates are planned and indicated:
  - Dynamic clue and vote updates in `play.html` using WebSocket placeholders.