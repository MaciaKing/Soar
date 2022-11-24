from ReadWriteFile.ReadFile import ReadFile 
#Encrypt
import os
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend


'''
#Params for connect to Splunk Api
HOST_API = '172.20.200.175'
USARNAME_API = 'oasoc.api'
PASSW_API = 'YItt@$cA6KSWc!'
PORT_API= 8089

#Params for connect Postgres database
USER_DB="soar"
PASSW_DB= "soar"
HOST_DB="localhost"
NAME_DB="soardatabase"
'''

class Credentials: 
    def __init__(self):
        #Params for connect to Splunk Api
        self.HOST_API = '172.20.200.175'
        self.USARNAME_API = 'oasoc.api'
        self.PASSW_API = 'YItt@$cA6KSWc!'
        self.PORT_API= 8089
        #Params for connect Postgres database
        self.USER_DB="soar"
        self.PASSW_DB= "soar"
        self.HOST_DB="localhost"
        self.NAME_DB="soardatabase"

    def readCredentials(self):
        f = ReadFile("../credentials")
        f.openFile()
        line=f.readLine()
        while(line != ""):
            print(line)
            line=f.readLine()



if __name__ == "__main__":  
    credentials = Credentials()
    credentials.readCredentials()
    #Encrypt
    pwd="soar"
    # Salts should be randomly generated
    salt = os.urandom(16)
    # derive
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=390000,
        backend=default_backend()
    )
    key = kdf.derive(b"my great password")
    print("key --> ", key)

    # verify
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=390000,
        backend=default_backend()
    )
    kdf.verify(b"my great password", key)
    print("key --> ", key)




