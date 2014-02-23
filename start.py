import simplejson as json, sys

keywords = ["data", "from", "picture", "source", "height", "width", "images", "link", "icon", "created_time", "updated_time", "likes", "comments", "previous", "next", "place", "paging", "name_tags", "id", "name", "tags"]

jsonobj = open("testdata.txt", "r").read().replace("[Object]", "\"[Object]\"")


newObj = ""
for keyword in keywords:
	while jsonobj != "":
		index = jsonobj.find(keyword)
		if (index == -1):
			newObj += jsonobj
			jsonobj = ""
			break
		newObj += jsonobj[:index]
		jsonobj = jsonobj[index + len(keyword):]
		if jsonobj[0] == ":":
			newObj += '"'+keyword+'"'
		else:
			newObj += keyword

	jsonobj = newObj
	newObj = ""



jsonobj = jsonobj.replace('\'', '"')

open("moor.txt", "w").write(jsonobj)

print jsonobj

data = json.loads(jsonobj)

print data
