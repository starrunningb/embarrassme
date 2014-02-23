import os

f = open('urls.txt');
lines = f.readlines();

for line in lines:
    os.system("chromium " + line);
