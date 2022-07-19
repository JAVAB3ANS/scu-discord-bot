# run this script with pm2 just like the main Discord bot

import os
import json
import requests
from requests.adapters import HTTPAdapter, Retry
from urllib.error import URLError, HTTPError 

with open("../config.json") as file:
    config = json.load(file)

"""

1. We create a new session object.
2. We create a new retry object.
3. We create a new HTTPAdapter object.
4. We mount the session to the HTTPAdapter object.
5. We make a get request to the verifyURL.
6. If the status code is not 200, we run the server.
7. If the status code is 200, we print the status code and the website is up! 

"""

try:  
    session = requests.Session()
    retry = Retry(connect=3, backoff_factor=0.5)
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)

    r = session.get(config["verification"]["verifyURL"]) 

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
    print ("HTTP Error:", errh)
    os.system(config["verification"]["server"])

except requests.exceptions.ConnectionError as errc:
    print ("Error Connecting:", errc)
    os.system(config["verification"]["server"])

except requests.exceptions.Timeout as errt:
    print ("Timeout Error:", errt)     
    os.system(config["verification"]["server"])
