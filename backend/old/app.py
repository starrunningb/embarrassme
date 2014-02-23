#!/usr/bin/env python
from flask import Flask, render_template

### CREATE APP ###
app = Flask(__name__)

### ROUTING ###
@app.route("/")
@app.route("/index.html")
def interface():
	return render_template("index.html")

if __name__ == "__main__":
	app.run(port=8080, debug = True)
