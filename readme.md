# Testing serverside compilation

#### Allows a user to submit code from the client and have it ran serverside.

#### We use a docker container to run the code then quit after completion, negating may effects of running untrusted code in the server

todo:

x Add error message return from the docker cont. instead of it just exiting out
x Embed user code with preset code to run tests according to the problem challenge selected
x Add test client with react
x Connect client to server
x Refactor DockerCompile to use a success callback

- Add a queue system (redis)
  x Implement a timeout procedure
  x Work around writing to file on host filesystem to avoid overwriting from concurrent requests
  x Delete the files on container before killing
- Tests:
  x create a file with tests
  x import the usercode file and invoke the function

More languages will be added once proof of concept is more refined, JS and Python are currently available by changing
the value provided to the server in the Monaco Editor component and axios request.

### How to use:

#### Fork and Clone Repository

#### Install dependencies 'npm i' or 'npm install'

#### Run 'node index'

#### cd client && npm start

#### Write a simple hellow world program and submit!
