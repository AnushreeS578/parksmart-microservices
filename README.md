# ParkSmart - Smart Parking Management System

## Overview

ParkSmart is a Smart Parking Management System developed using Spring Boot Microservices and React JS. The system enables users to search parking locations, book parking slots, make secure payments, receive notifications, and manage their parking history through a scalable and secure platform.

The project follows modern enterprise architecture principles using Spring Boot Microservices, React JS, JWT Authentication, Spring Cloud Gateway, Eureka Service Discovery, OpenFeign, MySQL, and REST APIs.

---

# Key Features

## Authentication & Authorization

* JWT-based Authentication
* User Registration and Login
* Role-Based Access Control
* Secure API Access

## User Management

* User Profile Management
* View Booking History
* Manage Account Information

## Parking Management

* View Available Parking Slots
* Add Parking Locations
* Update Parking Slot Availability
* Parking Status Tracking

## Booking Management

* Book Parking Slots
* Cancel Bookings
* View Booking Details
* Booking History Management

## Payment Management

* Secure Payment Processing
* Payment Status Tracking
* Payment History

## Notification Management

* Booking Notifications
* Payment Notifications
* User Alerts

---

# Architecture

The project consists of the following microservices:

| Service              | Port |
| -------------------- | ---- |
| Eureka Server        | 8761 |
| API Gateway          | 8080 |
| Auth Service         | 8081 |
| User Service         | 8082 |
| Parking Service      | 8083 |
| Booking Service      | 8084 |
| Payment Service      | 8085 |
| Email Service        | 8086 |
| Notification Service | 8087 |

---

# Communication

* Service Discovery: Eureka Server
* API Routing: Spring Cloud Gateway
* Inter-Service Communication: OpenFeign
* Authentication: JWT
* Database: MySQL

---

# Technology Stack

## Backend

* Java 17
* Spring Boot
* Spring Security
* JWT
* Spring Data JPA
* Eureka Discovery Server
* Spring Cloud Gateway
* OpenFeign
* Maven

## Frontend

* React JS
* React Router DOM
* Axios
* Bootstrap
* Redux Toolkit

## Database

* MySQL

---

# Databases Used

Each microservice uses its own database.

```sql
booking
notification
parking
password_reset_otp
payment
user
```

---

# Project Structure

```text
ParkSmart
│
├── eureka-server
├── api-gateway
├── auth_service
├── user_service
├── parking_service
├── booking_service
├── payment_service
├── notification-service
├── email-service
│
└── parksmart-frontend
```

---

# Prerequisites

Before running the project install:

* Java 17
* Maven
* MySQL Server
* Node.js
* npm
* Git

---

# How To Run The Project

## Step 1: Start MySQL

```sql
SHOW DATABASES;
```

---

## Step 2: Run Eureka Server

```bash
mvn spring-boot:run
```

Open:

http://localhost:8761

---

## Step 3: Run API Gateway

```bash
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8080
```

---

## Step 4: Start Microservices

Run services in the following order:

1. Auth Service
2. User Service
3. Parking Service
4. Booking Service
5. Payment Service
6. Notification Service
7. Email Service

Each service can be started using:

```bash
mvn spring-boot:run
```

---

## Step 5: Run Frontend

Navigate to frontend folder:

```bash
cd parksmart-frontend
```

Install dependencies:

```bash
npm install
```

Run application:

```bash
npm start
```

Frontend URL:

```text
http://localhost:3000
```

---

# Security

* JWT Authentication
* BCrypt Password Encryption
* Spring Security
* Role-Based Authorization

Roles:

* ADMIN
* USER

---

# Future Enhancements

* QR Code Based Parking Entry
* Online Payment Gateway Integration
* Real-Time Slot Monitoring
* Mobile Application
* Docker Deployment
* Kubernetes Deployment
* AI-Based Parking Recommendation

---

# Author

**Anushree S**

B.Tech Computer Science and Engineering

Presidency University
