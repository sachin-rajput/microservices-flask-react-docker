# Microservices with Docker, Flask, and React

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
