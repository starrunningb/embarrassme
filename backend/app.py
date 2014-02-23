#!/usr/bin/env python
from flask import Flask, render_template

### CREATE APP ###
app = Flask(__name__)

### ROUTING ###
@app.route("/")
def interface():
	return render_template("index2.html")

if __name__ == "__main__":
	app.run(debug = True)
