# Microservices with Docker, Flask, and React

[![Build Status](https://travis-ci.com/sachin-rajput/microservices-flask-react-docker.svg?branch=main)](https://travis-ci.com/github/sachin-rajput/microservices-flask-react-docker)

---

### To install Flask and Flask restful

```
$ cd services/users

$ python3.7 -m venv env
$ source env/bin/activate

(env)$ python -m pip install flask

(env)$ python -m pip install Flask-RESTful==0.3.7

```

#### Run the app, to enable debug mode by setting the FLASK_ENV environment variable to development:

```
(env)$ export FLASK_APP=project/__init__.py
(env)$ export FLASK_ENV=development
(env)$ python manage.py run

* Serving Flask app "project/__init__.py" (lazy loading)
* Environment: development
* Debug mode: on
* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
* Restarting with stat
* Debugger is active!
* Debugger PIN: 442-775-962

```

#### Common Commands

```
Build the images:
$ docker-compose build

Run the containers:
$ docker-compose up -d

Create the database:
$ docker-compose exec users python manage.py recreate_db

Seed the database:
$ docker-compose exec users python manage.py seed_db

Run the tests:
$ docker-compose exec users python manage.py test

```

#### Other commands

```
To stop the containers:
$ docker-compose stop

To bring down the containers:
$ docker-compose down

Want to force a build?
$ docker-compose build --no-cache

Remove images:
$ docker rmi $(docker images -q)

Postgres
Want to access the database via psql?
$ docker-compose exec users-db psql -U postgres

Then, you can connect to the database and run SQL queries. For example:

# \c users_dev

# select \* from users;

```

#### Docker commands

```
docker-machine stop testdriven-prod
```

```
docker-machine create --driver amazonec2 testdriven-prod
```

```
docker-machine start testdriven-prod
docker-machine regenerate-certs -f testdriven-prod
```

```
docker-machine env testdriven-prod
eval $(docker-machine env testdriven-prod)
export REACT_APP_USERS_SERVICE_URL=http://DOCKER_MACHINE_IP
docker-compose -f docker-compose-prod.yml up -d --build
```

### All Services

The following commands are for spinning up all the containers.

Environment Variables

#### Development:

```
$ export REACT_APP_USERS_SERVICE_URL=http://localhost
```

#### Staging:

```
$ export REACT_APP_USERS_SERVICE_URL=http://DOCKER_MACHINE_STAGING_IP
```

#### Production:

```
$ export REACT_APP_USERS_SERVICE_URL=http://DOCKER_MACHINE_PROD_IP
$ export SECRET_KEY=SOMETHING_SUPER_SECRET
```

#### Start

Build the images:

\$ docker-compose build

Run the containers:

\$ docker-compose up -d

Create and seed the database:

\$ docker-compose exec users python manage.py recreate_db

\$ docker-compose exec users python manage.py seed_db

Run the unit and integration tests:

\$ docker-compose exec users python manage.py test

Lint:

\$ docker-compose exec users flake8 project

Run the client-side tests:

\$ docker-compose exec client npm test -- --verbose

Run the e2e tests:

\$ ./node_modules/.bin/cypress open --config baseUrl=http://localhost

#### Stop

Stop the containers:

\$ docker-compose stop

Bring down the containers:

\$ docker-compose down
Remove images:

$ docker rmi $(docker images -q)

#### Individual Services

The following commands are for spinning up individual containers.

### Users DB

Build and run:

\$ docker-compose up -d --build users-db
Test:

\$ docker-compose exec users-db psql -U postgres

### Users

Build and run:

\$ docker-compose up -d --build users
To test, navigate to http://localhost:5001/users/ping in your browser.

Create and seed the database:

$ docker-compose exec users python manage.py recreate_db
$ docker-compose exec users python manage.py seed_db
To test, navigate to http://localhost:5001/users in your browser.

### Run the unit and integration tests:

\$ docker-compose exec users python manage.py test
Lint:

\$ docker-compose exec users flake8 project

### Client

Set env variable:

\$ export REACT_APP_USERS_SERVICE_URL=http://localhost
Build and run:

\$ docker-compose up -d --build client
To test, navigate to http://localhost:3007 in your browser.

Keep in mind that you won't be able to register or log in until Nginx is set up.

Run the client-side tests:

\$ docker-compose exec client npm test -- --verbose

### Swagger

Update swagger.json:

\$ python services/swagger/update-spec.py http://localhost
Build and run:

\$ docker-compose up -d --build swagger
To test, navigate to http://localhost:3008 in your browser.

### Nginx

Build and run:

\$ docker-compose up -d --build nginx
With the other services up, you can test by navigating to http://localhost in your browser.

Also, run the e2e tests:

\$ ./node_modules/.bin/cypress open --config baseUrl=http://localhost

### Aliases

To save some precious keystrokes, let's create aliases for both the docker-compose and docker-machine commands—dc and dm, respectively.

Simply add the following lines to your .bashrc file:

alias dc='docker-compose'
alias dm='docker-machine'
Save the file, then execute it:

\$ source ~/.bashrc
Test them out!

On Windows? You will first need to create a PowerShell Profile (if you don't already have one), and then you can add the aliases to it using Set-Alias—i.e., Set-Alias dc docker-compose.

### "Saved" State

Using Docker Machine for local development? Is the VM stuck in a "Saved" state?

\$ docker-machine ls

NAME ACTIVE DRIVER STATE URL SWARM DOCKER ERRORS
testdriven-prod \* amazonec2 Running tcp://34.207.173.181:2376 v18.09.2
testdriven-dev - virtualbox Saved Unknown
First, try:

\$ docker-machine start testdriven-dev
If that doesn't work, to break out of this, you'll need to power off the VM. For example, if you're using VirtualBox as your Hypervisor, you can:

Start virtualbox: virtualbox
Select the VM and click "start"
Exit the VM and select "Power off the machine"
Exit virtualbox
The VM should now have a "Stopped" state:

\$ docker-machine ls

NAME ACTIVE DRIVER STATE URL SWARM DOCKER ERRORS
testdriven-prod \* amazonec2 Running tcp://34.207.173.181:2376 v18.09.2
testdriven-dev - virtualbox Stopped
Now you can start the machine:

\$ docker-machine start testdriven-dev
It should be "Running":

\$ docker-machine ls

NAME ACTIVE DRIVER STATE URL SWARM DOCKER ERRORS
testdriven-prod \* amazonec2 Running tcp://34.207.173.181:2376 v18.09.2
testdriven-dev - virtualbox Running tcp://192.168.99.100:2376 v18.09.2
Can't Download Python Packages?
Again, using Docker Machine locally? Are you running into this error when trying to pip install inside a Docker Machine?

Retrying (Retry(total=4, connect=None, read=None, redirect=None))
after connection broken by 'NewConnectionError(
'<pip.\_vendor.requests.packages.urllib3.connection.VerifiedHTTPSConnection object at 0x7f0f88deec18>:
Failed to establish a new connection: [Errno -2] Name or service not known',)':
/simple/flask/
Restart the Machine and then start over:

$ docker-machine restart testdriven-dev
$ docker-machine env testdriven-dev
$ eval $(docker-machine env testdriven-dev)
\$ docker-compose up -d --build

### Other Commands

Want to force a build?

\$ docker-compose build --no-cache
Remove images:

$ docker rmi $(docker images -q)
Reset Docker environment back to localhost, unsetting all Docker environment variables:

$ eval $(docker-machine env -u)
Test Script
Run server-side unit and integration tests (against dev):

\$ sh test.sh server
Run client-side unit and integration tests (against dev):

\$ sh test.sh client
Run Cypress-based end-to-end tests (against prod)

\$ sh test.sh e2e
