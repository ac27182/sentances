static_site:
	node load.js
	node generator.js

clean:
	rm compiled/misc.html
	rm compiled/words.json

env:
	head external/key.txt