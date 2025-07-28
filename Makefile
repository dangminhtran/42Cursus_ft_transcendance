all: up

up:
	docker compose -f back_end/docker-compose.yml up --build -d

down:
	docker compose -f back_end/docker-compose.yml down

fclean:
	docker images -q | xargs -r docker rmi -f
	# docker volume rm -f `docker volume ls -q`
	docker container rm -f `docker container ls -q`

ls:
	docker image ls
	docker container ls
	docker network ls
	docker volume ls
	docker ps -a


re: down fclean all
	

.PHONY: all up down re
