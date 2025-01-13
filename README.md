### Nope to Dope  

This application allows players to test how well they know their friends’ opinions on fun and unexpected scales. Nope to Dope is a multiplayer guessing game designed for social interaction and engagement. The app allows up to 8 players per game and tracks scores across rounds. It combines creativity, humor, and real-time collaboration, ensuring an entertaining experience for all participants.

---

### Specification Deliverable  

#### Elevator Pitch  
Have you ever wondered how well you know your friends’ niche opinions? Nope to Dope is the ultimate social guessing game where players compete to match their friends’ opinions on dynamic, creative scales. From "disgusting to delicious" to "soft to hard," Nope to Dope keeps everyone engaged with fun clues, real-time voting, and friendly competition. Create or join a game, and see how well you know each other!

#### Design  
**Mockups**  
The app has three primary views:  
1. **Login Page**: Securely log in or create an account to start playing.  
2. **Game Setup Page**: Create or join a game using a unique code.  
3. **Game Page**: Displays the scale, countdown timer, player sliders, and live scoreboard.  

Mockup images of the Game Page for desktop and mobile are attached:  
- [Desktop View 1](desktopView1.png)  
- [Desktop View 2](desktopView2.png)  
- [Mobile View](mobileView.png)  

**Key Features**  
- Secure login over HTTPS.  
- Create or join a game with up to 8 players.  
- Unique scales fetched from the database for every round.  
- Real-time slider adjustments visible to all players via WebSocket.  
- Automatic scoring after each round with live leaderboard updates.  
- Content moderation for player-submitted clues using an external API.  
- Persistent storage of game data, including scores and scales used.

---

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
