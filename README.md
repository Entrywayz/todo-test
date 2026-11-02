# TaskFlow — To-Do List Application

Полнофункциональное веб-приложение для управления списком задач, построенное на стеке **Next.js + NestJS + PostgreSQL + Nginx** и полностью готовое к развёртыванию через Docker Compose.

---

## 🚀 Возможности

1. **Добавление задач**: создание задач с заголовком и опциональным подробным описанием.
2. **Отметка о выполнении**: быстрое переключение статуса задачи (в работе / выполнено) с плавной анимацией и прогресс-баром.
3. **Редактирование задач**: инлайн-редактирование заголовка и описания задачи.
4. **Удаление задач**: удаление задач с подтверждением и оптимистичным обновлением интерфейса.
5. **Фильтрация и поиск**: фильтрация по статусам (*Все*, *В работе*, *Завершённые*) и полнотекстовый поиск по заголовку и описанию.
6. **Персистентность**: хранение всех данных в реляционной базе данных **PostgreSQL** с автоматическим созданием таблиц через TypeORM.
7. **Reverse Proxy (Nginx)**: единая точка входа (по умолчанию на порту `8081`, настраивается через `.env`), перенаправляющая трафик к Next.js и NestJS API.
8. **Документация API (Swagger/OpenAPI)**: интерактивная документация всех эндпоинтов по адресу `/api/docs`.

---

## 🛠 Стек технологий

- **Frontend**:
  - [Next.js](https://nextjs.org/) (App Router, Turbopack, standalone mode)
  - [React](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Lucide Icons](https://lucide.dev/)
- **Backend**:
  - [NestJS](https://nestjs.com/)
  - [TypeORM](https://typeorm.io/) + [PostgreSQL Driver (pg)](https://node-postgres.com/)
  - [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer)
  - [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction) (OpenAPI 3.0)
- **Database**:
  - [PostgreSQL 16 Alpine](https://www.postgresql.org/)
- **Infrastructure**:
  - [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
  - [Nginx Alpine](https://nginx.org/) (Reverse Proxy, WebSockets support)

---

## 📁 Структура проекта

```text
todo/
├── backend/                  # NestJS сервер
│   ├── src/
│   │   ├── todo/             # Модуль задач (Entity, DTOs, Service, Controller)
│   │   ├── app.module.ts     # Корневой модуль с подключением TypeORM & Config
│   │   └── main.ts           # Точка входа, Swagger, валидация, CORS
│   ├── Dockerfile            # Multi-stage сборка для NestJS
│   └── package.json
│
├── frontend/                 # Next.js клиент
│   ├── src/
│   │   ├── app/              # App Router (layout, page, global css)
│   │   ├── components/       # Компоненты UI (TodoItem, TodoForm, TodoHeader, TodoFilter)
│   │   ├── lib/              # API клиент (fetch, error handling)
│   │   └── types/            # TypeScript интерфейсы
│   ├── Dockerfile            # Multi-stage сборка с output: "standalone"
│   └── package.json
│
├── nginx/
│   └── default.conf          # Конфигурация Nginx reverse proxy
│
├── .env.example              # Пример переменных окружения
├── .env                      # Локальные переменные окружения
├── docker-compose.yml        # Оркестрация контейнеров
└── README.md
```

---

## ⚡️ Быстрый запуск с Docker Compose

### 1. Клонирование и настройка окружения

При необходимости отредактируйте `.env` файл (по умолчанию порт Nginx `8081`, порт PostgreSQL `5434`, чтобы избежать конфликтов с системными службами):

```bash
cp .env.example .env
```

### 2. Сборка и запуск контейнеров

```bash
docker compose up --build -d
```

### 3. Доступ к приложению

- **Веб-интерфейс**: [http://localhost:8081](http://localhost:8081)
- **REST API эндпоинты**: [http://localhost:8081/api/todos](http://localhost:8081/api/todos)
- **Интерактивная Swagger документация**: [http://localhost:8081/api/docs](http://localhost:8081/api/docs)

### 4. Остановка контейнеров

```bash
docker compose down
# Для очистки volumes с базой данных:
docker compose down -v
```

---

## 📡 Спецификация REST API

| Метод | Эндпоинт | Описание | Пример тела запроса |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/todos` | Получить список задач (поддерживает `?search=...&completed=true/false`) | - |
| `GET` | `/api/todos/:id` | Получить одну задачу по ID | - |
| `POST` | `/api/todos` | Создать новую задачу | `{"title": "Купить продукты", "description": "Хлеб, молоко"}` |
| `PATCH` | `/api/todos/:id` | Частично обновить задачу | `{"title": "Обновленный заголовок", "isCompleted": true}` |
| `DELETE` | `/api/todos/:id` | Удалить задачу | - |

---

## 💻 Локальная разработка без Docker

### 1. База данных PostgreSQL
Запустите PostgreSQL локально или поднимите только контейнер БД:
```bash
docker compose up postgres -d
```

### 2. Запуск Backend
```bash
cd backend
npm install
DATABASE_PORT=5434 npm run start:dev
```
Сервер запустится на `http://localhost:3000` (API доступен по `http://localhost:3000/api`).

### 3. Запуск Frontend
```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:3000/api npm run dev
```
Клиент запустится на `http://localhost:3000` или `http://localhost:3001`.
