# run this script with pm2 just like the main Discord bot

import os
import json
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

with open("config.json") as file:
    config = json.load(file)
    
req = Request(config["verification"]["verifyURL"])

try:
    response = urlopen(req)

except HTTPError as e:
    print("The server couldn\'t fulfill the request.")
    print("Error code: ", e.code)
    os.system("sudo npm run server")

except URLError as e:
    print("We failed to reach a server.")
    print("Reason: ", e.reason)
    os.system("sudo npm run server")

else:
    print (response.read().decode("utf-8"))