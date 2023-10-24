# Testing serverside compilation

#### Allows a user to submit code from the client and have it ran serverside.

#### We use a docker container to run the code then quit after completion, negating may effects of running untrusted code in the server

todo:

- Add error message return from the docker cont. instead of it just exiting out
- Embed user code with preset code to run tests according to the problem challenge selected

More languages will be added once proof of concept is more refined, JS and Python are currently available by changing
the value provided to the server in client.js axios request.

### How to use:

#### Fork and Clone Repository

#### Install dependencies 'npm i' or 'npm install'

#### Run 'node index' and start up live server for the index.html

#### Submit some JS
