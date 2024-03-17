csv_dump:
	npm run execute:csv_dump

compile: 
	npm run execute:anki_compile
	npm run execute:html_compile

commit:
	git add compiled
	git commit -m 'compilation_update'
	git push

push: csv_dump compile commit