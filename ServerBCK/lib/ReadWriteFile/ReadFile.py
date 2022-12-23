class ReadFile:
    #Define pathFile.
    def __init__(self, pathFile):
        self.nameFile=pathFile
        self.f=None
        #Comprobar que el fichero exista
        #Si no existe saltará error
        self.openFile()
        self.closeFile()

    #Open the file
    def openFile(self):
        self.f=open(self.nameFile,'r')

    #Close the file
    def closeFile(self):
        self.f.close()

    #Read line by line all file
    #Return the line read or a empty string "" for end of file
    def readLine(self):
        return self.f.readline().strip('\n') #Strip --> remove '\n' 

    #Read all the file char by char
    def readChar(self):
        None
