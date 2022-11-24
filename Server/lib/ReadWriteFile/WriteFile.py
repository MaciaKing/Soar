class WriteFile:
    def __init__(self, pathFile):
        self.nameFile=pathFile
        self.f=None
        #Comprobar que el fichero exista
        #Si no existe saltará error
        self.openFile()
        self.closeFile()
    
    #Open the file
    def openFile(self):
        self.f=open(self.nameFile,'w',encoding='utf-8')

    #Close the file
    def closeFile(self):
        self.f.close()

    #Read line by line all file
    #Return the line read or a empty string "" for end of file
    def writeLine(self,newLine):
        self.f.writelines(newLine)
    
    #Read line by line all file
    #Return the line read or a empty string "" for end of file
    def writeChar(self,char):
