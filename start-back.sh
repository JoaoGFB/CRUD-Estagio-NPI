#!/bin/bash
echo "Ligando banco de dados..."
sudo systemctl start postgresql
echo "Iniciando backend (Spring Boot)..."
cd demo
./mvnw spring-boot:run
