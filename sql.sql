-- detta är vad du behöver för att kunna köra servern
-- 1. skapa en användare i din sql terminal. (om du redan har en med alla behörigheter)
-- 2. Skriv in alla uppgfter för databasen i varibeln db
-- 3. skapa databasen via commandot:
CREATE DATABASE databas;
USE databas;
-- 4. skapa de två tabellerna som behövs:
CREATE TABLE msg (msg TEXT, created DATE, user TEXT);
CREATE TABLE user (name TEXT, password TEXT);
-- 5. create a user so you can loggin på hemsidan
INSERT INTO user VALUES (YOUR_NAME , YOUR_PASSWORD);
-- 6. HAVE FUN
