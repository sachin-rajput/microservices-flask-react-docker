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
docker-machine start testdriven-prod
docker-machine regenerate-certs -f testdriven-prod
```

```
docker-machine env testdriven-prod
eval $(docker-machine env testdriven-prod)
export REACT_APP_USERS_SERVICE_URL=http://DOCKER_MACHINE_IP
docker-compose -f docker-compose-prod.yml up -d --build
```
