# Auction

Auction to strona aukcyjna, na której użytkownicy mogą wystawiać przedmioty na sprzedaż i brać udział w aukcjach. Strona jest napisana w Node.js i korzysta z MongoDB do przechowywania danych.

## Wymagania

- Node.js (v14 lub nowszy)
- MongoDB

## Instalacja

1. **Klonowanie repozytorium**

   Najpierw sklonuj repozytorium na swoje urządzenie:

   ```sh
   git clone https://github.com/milmanart/auction.git
   cd auction

2. **Instalacja zależności**

    Upewnij się, że masz zainstalowany Node.js. Następnie zainstaluj wszystkie wymagane zależności:
    
    ```sh
   npm install

3. **Konfiguracja MongoDB&**

   Upewnij się, że masz zainstalowaną i uruchomioną bazę danych MongoDB. Domyślnie aplikacja jest skonfigurowana do łączenia się z lokalnym serwerem MongoDB:
    
    ```sh
   mongodb://localhost:27017/auction-system
    
4. Uruchomienie aplikacji

   Po zainstalowaniu zależności i skonfigurowaniu MongoDB, uruchom aplikację:
    
    ```sh
   npm start