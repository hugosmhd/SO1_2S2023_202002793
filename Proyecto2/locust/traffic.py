import time
from locust import HttpUser, task
import json
import random

class QuickstartUser(HttpUser):
    casos = []
    with open('traffic.json') as json_file:
        data = json.load(json_file)
        casos.extend(data)

    @task
    def insercion_caso(self):
        time.sleep(1)
        response = self.client.post("/add",json=random.choice(self.casos))
        json_response_dict = response.json()
        print(response.json())


# -------------------------------------------------------------------------------------------------
# # from locust import HttpUser, task

# # class Clase5(HttpUser): 
# #     @task
# #     def add(self):
# #         self.client.post("/add", {"name":"GERMAN","id":201902934})

# import json
# from random import randrange
# from locust import HttpUser, between, task

# class readFile():
#     def __init__(self):
#         self.data = []

#     def getData(self): #Metodo donde se obtiene un elemento de la lista de registros
#         size = len(self.data) #Tamaño de los datos
#         if size > 0:
#             index = randrange(0, size - 1) if size > 1 else 0
#             return self.data.pop(index)
#         else:
#             print("size -> 0")
#             return None
    
#     def loadFile(self):
#         print("LOADING ...")
#         try:
#             with open("traffic2.json", 'r') as file:
#                 self.data = json.loads(file.read())
#         except Exception:
#             print(f'Error : {Exception}')

# class trafficData(HttpUser):
#     wait_time = between(0.1, 0.9) #Tiempo de espera entre registros
#     reader = readFile()
#     reader.loadFile()

#     def on_start(self):
#         print("On Start")
    
#     @task
#     def sendMessage(self):
#         data = self.reader.getData() #Registro obtenido de la lista
#         if data is not None:
#             res = self.client.post("/add", json=data)
#             response = res.json()
#             print(response)
#         else:
#             print("Empty") #No hay mas datos por enviar
#             self.stop(True)