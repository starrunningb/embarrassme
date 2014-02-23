import simplejson as json, sys

keywords = ["data", "from", "picture", "source", "height", "width", "images", "link", "icon", "created_time", "updated_time", "tags", "likes", "comments", "id"]

jsonobj = open("test.txt", "r").read().replace("[Object]", "\"[Object]\"")
newObj = ""
for keyword in keywords:
	buf = ""
	string = jsonobj
	while string != "":
		index = string.find(keyword)
		if index == -1:
			buf += string
			string = ""
			break
		else:
			buf = string[:index]
			string = string[index + len(keyword):]
			if string[0] == ':':
				buf += '"'
				buf += keyword
				buf += '"'
			else:
				buf += keyword
		print buf + ", " + keyword + "\n"
	newObj += buf
#print newObj	
data = json.loads(newObj)

print data
