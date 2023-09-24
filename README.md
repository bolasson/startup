# Dart Battles
### Elevator Pitch
Have you ever looked for new and exhilrating ways to play with foam dart blasters to no avail? Then look no further! Regardless of age, skill, or resources, Dart Battles provides a forum for people to share unique dart blasting scenarios and games. Keep up to date with experienced players sharing their best ideas and new ones reviewing them. Whether you're a hosting a birthday party, a corporate event, spending time with friends, or even a family get together, you can research and host a fun and fair dart blasting session with confidence.

### Design
Below are visuals for a home page and an example forum page, respectively.

![Home Page](StartupHomeScreenFinal.jpg) ![Forum Page](StartupContentScreenFinal.jpg)

Below is a visual of how the users may interact with the backend.

![Voting sequence diagram](postingSequenceDiagramFinal.jpg)

### Key Features
+ Secure login over HTTPS
+ Display of recommended searchs
+ Ability to custom search by selecting key parameters
+ Ability for users to submit their own games ideas
+ Ability for users to rank and review published game ideas
+ Notify users when their submissions have been reviewed or ranked
+ Admin can filter, tag, and sort user publications as needed

### Use of Technologies
The required technologies for this course will be applied as follows
- **HTML**
    - Correct structure for application
    - Three pages. One home page, one to search and return results, and one for logging in.
- **CSS**
    - Mobile and desktop formatting 📱💻
    - Invites user to scroll
    - Color scheme that matches images provided
- **JavaScript**
    - Provides login / sign up service
    - Display current rankings for submissions 💯
    - Backendpoint calls
- **Service** - Backend servce with endpoints for:
    - Logging in
    - Searching and displaying game ideas
    - Submitting game ideas
    - Ranking and reviewing submissions
    - Notfiy users of new submissions 📧
- **DB** - Stores the following in a database
    - Users
    - Search Querys
    - Game Ideas
    - Reviews and Rankings
- **Login**
    - Register and login users
    - Store credientials and contact information 🔒
    - Can't submit, rank, or review unless authenticated.

> [!NOTE]
> I don't fully understand the capabillities or purpose of the following two technologies. As such I have filled them out to the best of my abillities!

- **WebSocket**
    - Whenever a submission is posted, it notifies all users with an account
    - Whenever a submission is ranked or reviewed, it notifies the author 
- **React**
    - Application ported to use the React web framework.
