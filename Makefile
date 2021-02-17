.PHONY: up down clean ui start stop reset

up:
	docker-compose up -d

ui: up
	open http://localhost:15672

down:
	docker-compose down

clean:
	docker-compose down -v

start:
	yarn start:all

stop:
	yarn stop:all
	yarn pm2 delete all

reset: stop clean up start
