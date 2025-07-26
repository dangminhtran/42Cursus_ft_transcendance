all: vault ssl up

VAULT_ADDR=http://127.0.0.1:8200
VAULT_SECRET_PATH=secret/ssl/certs
SSL_PATH=back_end/modsecurity/ssl

export VAULT_ADDR

vault:
	@./setup_vault_ssl.sh
	@rm vault-dev.log

ssl:
	@echo "Fetching SSL certs from Vault..."
	@vault kv get -field=cert $(VAULT_SECRET_PATH) > $(SSL_PATH)/cert.pem
	@vault kv get -field=key $(VAULT_SECRET_PATH) > $(SSL_PATH)/key.pem
	@echo "Certificates saved to $(SSL_PATH)/"

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