# Alum-net

**Alum-net** is a **Virtual Learning Environment (VLE)** for **students, professors, and administrators**, providing academic and administrative tools across multiple platforms.

## Overview

Alum-net includes:

* **Java backend**

  * Core application logic
  * Persistent storage via **PostgreSQL** and **MongoDB**

* **React Native frontend**

  * Shared codebase for both **web (SPA)** and **mobile apps**
  * Unified UI for all user roles

## Architecture

The repository is organized into:

* `backend/` — Java application source
* `frontend/` — React Native web & mobile code
* `test/` — Automated tests and test cases
* `.github/workflows/` — CI/CD workflows

The project combines TypeScript (frontend) and Java (backend) code.

## Purpose

Alum-net supports learning activities and management tasks for academic users, integrating cross-platform access and robust data storage.

## Languages & Technologies

* **Backend:** Java
* **Frontend:** React Native (TypeScript)
* **Databases:** PostgreSQL, MongoDB
* **Testing:** Automated tests present in `test/` folder
