# Używamy obrazu Node.js
FROM node:18

# Ustawiamy katalog roboczy wewnątrz kontenera
WORKDIR /app

# Kopiujemy pliki projektu
COPY package.json package-lock.json ./
RUN npm install

# Kopiujemy resztę plików
COPY . .

# Uruchamiamy aplikację React
CMD ["npm", "start"]
