dev-up:
	docker compose up -d --build && docker logs -f kanban-server-dev
