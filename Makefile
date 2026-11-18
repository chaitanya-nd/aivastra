.PHONY: help dev up down logs build reset import seed migrate

help:           ## list commands
	@grep -E '^[a-z-]+:.*##' $(MAKEFILE_LIST) | sed 's/:.*##/ -/'

dev:            ## local dev: Postgres in Docker + site & admin with hot reload (http://localhost:3100, /admin)
	docker compose up -d --wait postgres
	pnpm dev

up:             ## everything in Docker (db + site + admin), detached
	docker compose --profile app up -d --build

down:           ## stop everything (data kept)
	docker compose --profile app down

logs:           ## follow app logs
	docker compose logs -f app

build:          ## rebuild the app image and recreate the container (fresh Next build)
	docker compose --profile app build
	docker compose --profile app up -d --force-recreate app

reset:          ## DANGER: stop and delete the database + media volumes
	docker compose --profile app down -v

import:        ## import the WordPress export into the running container's DB
	docker compose exec app pnpm import:wp
	docker compose exec app docker/revalidate.sh

seed:           ## demo data
	docker compose exec app pnpm seed
	docker compose exec app docker/revalidate.sh

migrate:        ## apply DB migrations manually
	docker compose exec app pnpm migrate
