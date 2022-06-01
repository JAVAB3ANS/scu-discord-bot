# run this script with pm2 just like the main Discord bot

import os
import json
import requests
from urllib.error import URLError, HTTPError 

with open("../config.json") as file:
    config = json.load(file)

try:  
    r = requests.get(config["verification"]["verifyURL"]) 

    if r.status_code != 200:
        os.system(config["verification"]["server"])
    else:
        print(str(r.status_code) + ": Website is up!")

except HTTPError as e:
        print("The server couldn\'t fulfill the request.")
        print("Error code: ", e.code)
        os.system(config["verification"]["server"])

except URLError as e:
    print("We failed to reach a server.")
    print("Reason: ", e.reason)
    os.system(config["verification"]["server"])

except requests.exceptions.HTTPError as errh:
    print ("Http Error:", errh)
    os.system(config["verification"]["server"])

except requests.exceptions.ConnectionError as errc:
    print ("Error Connecting:", errc)
    os.system(config["verification"]["server"])

except requests.exceptions.Timeout as errt:
    print ("Timeout Error:", errt)     
    os.system(config["verification"]["server"])