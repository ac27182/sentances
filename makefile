clean:
	rm -rf data/*
	mkdir data/csv_anki
	mkdir data/csv_raw
	mkdir data/json_compiled

download:
	node execute_csv_dump.js

compile:
	node execute_compile.js

static-site: download compile