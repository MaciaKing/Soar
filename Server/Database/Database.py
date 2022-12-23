import psycopg2

class Database():

    def __init__(self):
        #Params for connect Postgres database
        self.USER_DB="soar"
        self.PASSW_DB= "soar"
        self.HOST_DB="localhost"
        self.NAME_DB="prueba"
        self.connection = psycopg2.connect(
            host=self.HOST_DB,
            database=self.NAME_DB,
            user=self.USER_DB,
            password=self.PASSW_DB)


    def make_query(self, query):
        cur = self.connection.cursor()
        cur.execute(query)
        id = cur.fetchall()

        #print("id= ",id," typeId= ",type(id))
        #print(id[0], " type --> ", type(id[0]))
        #print("final result--> ",id[0][0])

        cur = self.connection.cursor()
        self.connection.commit()
        cur.close()
        return id[0][0] #return the id of the last insert


    def make_insert_database(self, inserts : list):
        '''
        param: inserts [] Array of differents inserts.

        Connect to database and execute the differents inserts of param 'inserts'
        '''
        cur = self.connection.cursor()
        for insert in inserts:
            #print("insert --> ", insert)
            cur.execute(insert)

        cur = self.connection.cursor()
        self.connection.commit()
        cur.close()


    def join_all_inserts(self, all_inserts : list, on_conflict_insert=""):
        '''
        Join differents insert for the same table.
        Return a string with all this inserts.

        For example if we have
        Insert into <table>(...) values (...);  :a1
        Insert into <table>(...) values (...);  :a2
        ...
        Insert into <table>(...) values (...);  :an

        For do this inserts more efectivly is better do
        Insert into <table>(...) values a1, ..., an;
        '''
        if len(all_inserts)==0:
            return -1

        if len(all_inserts)==1:
            return all_inserts[0]
        

        final_insert=""
        first_value=True
        for i in all_inserts:
            aux=i.upper().split("VALUES (")
            #print(aux,"\n")
            if first_value:
                final_insert+=aux[0]+" VALUES (" #This is INSERT INTO <table> values
                final_insert+=aux[1]
                first_value=False
            else:
                final_insert+=", " #For separate diferents inserts
                final_insert+="("+aux[1]
        #if final_insert == "":
        #    return -1
        #else:
            final_insert += on_conflict_insert
        return final_insert


## Testing ## 
#join_all_inserts#
'''
database = Database()

list_querys = ["INSERT INTO persona(nombre, edad, DNI) VALUES ('macia','10','asdf')", "INSERT INTO persona(nombre, edad, DNI) VALUES ('juan','39','fghf')"]
res=database.join_all_inserts(list_querys)
print(res,'\n')

list_querys = []
res=database.join_all_inserts(list_querys)
print(res,'\n')

list_querys = ["INSERT INTO persona(nombre, edad, DNI) VALUES ('macia','10','asdf')"]
res=database.join_all_inserts(list_querys, "ON CONFLICT (dni) ")
print(res,'\n')
'''

##make_insert_database(self, insert)
# make_insert_database(insert)

database = Database()

insert = ["INSERT INTO usr(name) VALUES ('test1'), ('test2')", "INSERT INTO usr(name) VALUES ('test4'), ('test3')"]
res=database.make_insert_database(insert)



