# Pharmacy Management System

A full-stack pharmacy management platform consisting of a Spring Boot REST API, an Angular customer-facing storefront, and an Angular admin panel.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running Locally](#running-locally)
  - [Running with Docker Compose](#running-with-docker-compose)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
  - [Kubernetes](#kubernetes)
  - [Terraform (AWS)](#terraform-aws)
- [Admin Panel Structure](#admin-panel-structure)
- [Contributing](#contributing)

---

## Overview

The Pharmacy Management System allows customers to browse and purchase medicines, manage prescriptions, and track orders. Administrators can manage inventory, monitor sales, handle prescriptions, and view detailed reports through a dedicated admin dashboard.

---

## Tech Stack

### Backend (`api/`)
| Technology | Version |
|---|---|
| Java | 21 |
| Spring Boot | 3.4.3 |
| Spring Security (JWT) | — |
| Spring Data JPA | — |
| PostgreSQL | — |
| Spring Mail | — |
| Springdoc OpenAPI (Swagger) | 2.8.4 |
| Lombok | — |

### Customer UI (`pharmacy-ui/`)
| Technology | Version |
|---|---|
| Angular | 21 |
| Angular Material | 21 |
| TailwindCSS | 4 |
| Chart.js / ng2-charts | 4 / 8 |
| Leaflet (maps) | 1.9 |
| jsPDF | 4 |

### Admin Panel (`pharmacy-admin-panel/`)
| Technology | Version |
|---|---|
| Angular | 21 |
| TailwindCSS | 4 |

### Infrastructure
- **Docker / Docker Compose** – containerised local development
- **Kubernetes** – production-grade orchestration
- **Terraform** – AWS infrastructure as code
- **Prometheus / Grafana** – metrics and monitoring

---

## Project Structure

```
Pharmacy/
├── api/                      # Spring Boot REST API
│   ├── src/main/java/com/kipcollo/
│   │   ├── auth/             # JWT authentication & registration
│   │   ├── cart/             # Cart management & scheduling
│   │   ├── configs/          # Security, JWT, Swagger configuration
│   │   ├── email/            # Email notification service
│   │   ├── exceptions/       # Custom exception classes
│   │   ├── handler/          # Global exception handler
│   │   ├── model/            # Domain models (Doctor, Feedback, Pharmacists, Suppliers)
│   │   ├── orders/           # Order processing
│   │   ├── orderlines/       # Order line items
│   │   ├── payments/         # Payment processing
│   │   ├── prescriptions/    # Prescription management
│   │   ├── products/         # Medicine, categories, health conditions, special offers
│   │   └── user/             # Customer & user management
│   └── Dockerfile
├── pharmacy-ui/              # Angular customer storefront
│   └── src/app/
│       ├── auth/             # Login, register, account activation
│       ├── cart/             # Shopping cart
│       ├── chat/             # Customer chat
│       ├── checkout/         # Checkout flow
│       ├── doctor/           # Doctor consultation
│       ├── map/              # Pharmacy locator (Leaflet)
│       ├── orders/           # Order history & tracking
│       ├── pages/            # Home, About, Contact pages
│       ├── prescriptions/    # Upload & track prescriptions
│       ├── user/             # Customer profile
│       ├── wishlist/         # Wishlist
│       └── admin/            # Embedded admin views
│           └── reports/      # Cart, customer, orders, revenue, profit, forecast, refunds
├── pharmacy-admin-panel/     # Standalone Angular admin panel
├── docker-compose.yaml       # Local multi-service setup
├── k8s/                      # Kubernetes manifests
├── main.tf                   # Terraform AWS configuration
├── prometheus.yaml           # Prometheus scrape config
└── grafana.env               # Grafana environment variables
```

---

## Features

### Customer-Facing
- **Authentication** – register, login, JWT-secured sessions, email account activation
- **Medicine Catalogue** – browse products by category and health condition
- **Special Offers** – highlighted promotional products
- **Shopping Cart** – add/remove items, cart persistence
- **Checkout & Orders** – place orders, view order history and tracking
- **Payments** – multiple payment methods
- **Prescriptions** – upload and track prescriptions
- **Wishlist** – save favourite products
- **Pharmacy Locator** – interactive map powered by Leaflet
- **Chat** – real-time customer chat
- **User Profile** – manage personal details

### Admin
- **Dashboard** – KPIs: total sales, active carts, revenue today, new users, low-stock alerts, pending orders
- **Cart Management** – view active, abandoned, placed, and recovered carts
- **Inventory / Medicine** – add, edit, and categorise products; stock alerts
- **Order Management** – view and process orders; order line details
- **Prescription Review** – review and approve/reject customer prescriptions
- **Customer Management** – view all customers, roles & permissions
- **Reports**
  - Cart reports (started, abandoned, placed, recovered)
  - Orders reports
  - Revenue reports
  - Customer behaviour reports
  - Profit & forecast reports
  - Refunds reports
- **Payments** – payment settings and transaction overview
- **Settings** – system, shipping, and payment configuration
- **Notifications** – in-app and email notifications

---

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 20+ and npm
- Angular CLI 21 (`npm install -g @angular/cli`)
- PostgreSQL 15+ (or Docker)
- Docker & Docker Compose (optional)

### Running Locally

#### 1. Database

Create a PostgreSQL database named `Pharmacy`:

```sql
CREATE DATABASE "Pharmacy";
```

#### 2. Backend API

```bash
cd api
# Configure credentials in src/main/resources/application-dev.properties if needed
./mvnw spring-boot:run
```

The API starts on **http://localhost:8080**.

#### 3. Customer UI

```bash
cd pharmacy-ui
npm install
ng serve
```

The UI starts on **http://localhost:4200**.

#### 4. Admin Panel

```bash
cd pharmacy-admin-panel
npm install
ng serve --port 4201
```

The admin panel starts on **http://localhost:4201**.

### Running with Docker Compose

```bash
docker compose up
```

| Service | URL |
|---|---|
| Customer UI | http://localhost:80 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5430 |
| MailDev (email) | http://localhost:1025 |

---

## API Documentation

Swagger UI is available when the API is running:

```
http://localhost:8080/swagger-ui/index.html
```

The OpenAPI JSON spec used by the frontend code generator is located at:

```
pharmacy-ui/src/openapi/openapi.json
```

Regenerate the Angular service client after updating the spec:

```bash
cd pharmacy-ui
npm run api-gen
```

---

## Deployment

### Kubernetes

Apply the manifests in order:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/pharmacy-deployment-api.yaml
kubectl apply -f k8s/pharmacy-deployment-ui.yaml
```

| Resource | Image | Port |
|---|---|---|
| pharmacy-api | `kipcollo/pharmacy:1.0.0` | 8080 (ClusterIP) |
| pharmacy-ui | `kipcollo/pharmacy:2.0.0` | 80 (LoadBalancer) |

### Terraform (AWS)

```bash
terraform init
terraform plan
terraform apply
```

Infrastructure is provisioned in the `us-east-1` region using the AWS provider `~> 4.0`.

---

## Admin Panel Structure

```
Dashboard
├── Overview (KPIs: total sales, active carts, revenue today)
└── Quick Stats (new users, low stock alerts, pending orders)

Orders / Cart Management
├── Active Carts
├── Abandoned Carts
├── Placed Orders
└── Recovered Carts

Products / Inventory
├── All Products
├── Add Product
├── Stock Alerts / Low Inventory
└── Categories

Prescriptions
└── Review & approve customer prescriptions

Users / Customers
├── All Customers
├── Roles & Permissions
└── Activity Logs

Reports
├── Cart Reports (started, abandoned, placed, recovered)
├── Orders Reports
├── Revenue Reports
├── Customer Reports
├── Profit Reports
├── Forecast Reports
└── Refunds Reports

Settings
├── Payment Settings
├── Shipping / Delivery Settings
└── System Settings
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request
