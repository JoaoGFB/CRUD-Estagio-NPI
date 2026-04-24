#!/bin/bash
echo "Encerrando processos e limpando RAM..."
pkill -f 'java'
pkill -f 'node'
sudo systemctl stop postgresql
echo "Status da memória após a limpeza: "
free -h
