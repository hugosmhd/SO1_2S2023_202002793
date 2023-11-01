import time
from locust import HttpUser, between, task
import json
import random
from random import randrange

class Reader():
    def __init__(self) -> None:
        self.array = []

    def pickRandom(self):
        length = len(self.array)

        if ( length > 0 ):
            random_index = randrange(0, length - 1) if length > 1 else 0
            return self.array.pop(random_index)
        else:
            print(">> Reader: No encontramos valores en el archivo")
            return None

    def load(self):
        print(">> Reader: Iniciando lectura del archivo de datos")
        try:
            with open("entrada.json", "r") as data_file:
                self.array = json.loads(data_file.read())
        except Exception as error:
            print(f'>> Reader: Error en {error}')

class QuickstartUser(HttpUser):
    wait_time = between(0.1, 0.9)
    reader = Reader()
    reader.load()

    @task
    def PostMessage(self):
        random_data = self.reader.pickRandom()
        if ( random_data is not None ):
            data_to_send = json.dumps(random_data)
            self.client.post("/", json=random_data)
        else:
            print(">> MessageTraffic: Envío finalizado")
            self.stop(True)

    def on_start(self):
        # Puedes agregar lógica de inicialización si es necesario
        pass
