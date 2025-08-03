# =======================
# 🚀 Docker Makefile
# =======================

all: up

up:
	@echo "🔧 [UP] Build & start containers (silent)..."
	@bash -c '\
		spinner="/|\\-"; \
		i=0; \
		( docker compose -f docker-compose.yml up --build -d ) & \
		pid=$$!; \
		while kill -0 $$pid 2>/dev/null; do \
			i=$$(( (i + 1) % 4 )); \
			printf "\r⏳ Building... %s" "$${spinner:$$i:1}"; \
			sleep 0.2; \
		done; \
		wait $$pid; \
		status=$$?; \
		if [ $$status -eq 0 ]; then \
			sleep 3; \
			printf "\r✅ Containers are up and running!   \n"; \
		else \
			printf "\r❌ Failed to start containers.     \n"; \
		fi'


down:
	@echo "🛑 [DOWN] Stopping containers..."
	@docker compose -f docker-compose.yml down > /dev/null 2>&1 && \
	echo "✅ Containers stopped." || \
	echo "⚠️ Nothing to stop or already stopped."

fclean:
	@echo "🧹 [FCLEAN] Removing containers and images..."
	@docker container ls -aq | xargs -r docker container rm -f > /dev/null 2>&1 && echo "✅ Containers removed."
	@docker images -q | xargs -r docker rmi -f > /dev/null 2>&1 && echo "✅ Images removed."
	@echo "⚠️  Volumes not deleted by default. Use 'make wipe' to remove all volumes."

wipe:
	@echo "💣 [WIPE] Removing all volumes except grafana-storage and elasticsearch_data..."
	@docker volume rm $$(docker volume ls -q | grep -v -e 'ft_transcendance_grafana-storage' -e 'ft_transcendance_elasticsearch_data') > /dev/null 2>&1 && \
	echo "✅ Volumes deleted." || \
	echo "⚠️ No volumes to delete or only excluded volumes present."

ls:
	@echo "📦 Images:" && docker image ls
	@echo "\n📦 Containers:" && docker container ls -a
	@echo "\n🌐 Networks:" && docker network ls
	@echo "\n💾 Volumes:" && docker volume ls
	@echo "\n🚢 Running containers:" && docker ps

re: down fclean all

.PHONY: all up down re fclean wipe ls

