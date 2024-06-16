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
   
2. **Instalacja Node.js**
    Upewnij się, że masz zainstalowany Node.js. Jeśli nie, postępuj zgodnie z poniższymi krokami.

    Windows:
    1. Pobierz instalator z oficjalnej strony Node.js.
    2. Uruchom instalator i postępuj zgodnie z instrukcjami.
   
    macOS:
    1. Zainstaluj Homebrew, jeśli jeszcze go nie masz:
    ```sh
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" 
    ```
    2. Zainstaluj Node.js:
    ```sh
    brew install node
    ```
   
    Linux:
    1. Postępuj zgodnie z instrukcjami dla swojej dystrybucji na oficjalnej stronie Node.js.

3. **Instalacja MongoDB**

   Windows:
   1. Pobierz instalator z oficjalnej strony MongoDB.
   2. Uruchom instalator i postępuj zgodnie z instrukcjami.
   3. Upewnij się, że usługa MongoDB jest uruchomiona:
   ```sh
   net start MongoDB
   ```
   macOS:
   1. Zainstaluj Homebrew, jeśli jeszcze go nie masz:
   ```sh
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   2. Zainstaluj MongoDB:
   ```sh
   brew tap mongodb/brew
   brew install mongodb-community@5.0
   ```
   
   3. Uruchom usługę MongoDB:
   ```sh
   brew services start mongodb/brew/mongodb-community
   ```
   Linux:
   1. Postępuj zgodnie z instrukcjami dla swojej dystrybucji na oficjalnej stronie MongoDB.


4. **Instalacja zależności**

    Upewnij się, że masz zainstalowany Node.js. Następnie zainstaluj wszystkie wymagane zależności:
    
    ```sh
   npm install

5. **Konfiguracja MongoDB&**

   Upewnij się, że masz zainstalowaną i uruchomioną bazę danych MongoDB. Domyślnie aplikacja jest skonfigurowana do łączenia się z lokalnym serwerem MongoDB:
    
    ```sh
   mongodb://localhost:27017/auction-system

6. Uruchomienie aplikacji

   Po zainstalowaniu zależności i skonfigurowaniu MongoDB, uruchom aplikację:
    
    ```sh
   npm start

**Dodatkowe informacje**

   1. Aby zatrzymać serwer Node.js, możesz użyć Ctrl+C w terminalu, w którym serwer jest uruchomiony.
   2. Jeśli port 3000 jest zajęty, możesz zmienić port w pliku app.js na inny dostępny port.