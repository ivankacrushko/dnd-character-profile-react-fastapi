# Używamy oficjalnego obrazu Pythona
FROM python:3.12

# Ustawiamy katalog roboczy wewnątrz kontenera
WORKDIR /app

# Kopiujemy pliki projektu
COPY . /app

# Instalujemy zależności
RUN pip install --no-cache-dir -r requirements.txt

# Otwieramy port, na którym działa FastAPI
EXPOSE 8000

# Uruchamiamy aplikację FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]