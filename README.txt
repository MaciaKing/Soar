Las alertas tardan tanto en cargar porque envia demasiadas. Si te fijas, abajo de la tabla de la IGU, veras el número de alertas que se están cargando. 
Esto habia pensado reducirlas con una query de solo un dia como en splunk (Si es así irá mucho más rápido).

Sobre la BD, en la tabla events, podrias provar de poner como PRIMARY KEY el raw del evento. Pero no es adecuado ya que por cada query tendrá que comprovar un String
largisimo. Estaría interesante si queires ordenar estos eventos, crear una PRIMARY KEY q sea un integer (que se actualiza solo cada vez q hay un insert, en postgrees es "serial"). Esta guay alomejor hacer este primary key, ya q tendrás las tablas ordenadas y los eventos se pueden ordenar por tiempo más rapidamente. 

Pero por ahora si lo dejas sin Primary va bien. Lo que sí o sí la query para sacar los eventos tiene que ser LIMIT 1(Es decir solo te sale un evento) . Imaginate que de una alerta tienes 5 eventos. Además de q cada evento casi siempre es muy parecido (no aporta más info), en la GUI te va a ocupar un monton y ni los podras ver correctamente. Lo que es interesante, es crear un panel de debajo las alertas, donde salgan todos estos eventos sin que moleste al tratamiento de las alertas o donde te salgan todos los raws que te han hecho saltar esa alerta que ocupara menos.

Cada alerta, en su raw tiene su identificador de su propia alerta (es el id de la base de datos).

 
