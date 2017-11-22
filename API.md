# API's

## Login

http://190.221.146.245:8090/login

Parametros:
 - email
 - password

Método: POST

## Api Test

http://190.221.146.245:8090/appointments/{terminal}/{pag_inicio}/{pag_fin}

Parametros:
 - terminal
 - pag_inicio: Paginador Inicio
 - pag_fin: Paginador Fin


## Api para consulta de Turno por Tractor por medio de la Patente

http://190.221.146.245:8090/zap/turno/patente/{patente}

### Ejemplo

**GET** http://190.221.146.245:8090/zap/turno/patente/CAM009

## Api para consulta de CNRT por Tractor por medio de la Patente

http://190.221.146.245:8090/zap/cnrt/patente/{patente_tractor}

### Datos del Tractor

 * Dominio
 * Año modelo
 * Empresa Nro
 * Paut
 * País
 * Nro Chasis
 * Cantidad Ejes
 * Tipo Vehiculo
 * Chasis Marca
 * Tipo Vehiculo
 * Tipo Carroceria
 * Razón Social
 * Tipo Documento
 * Documento

### Ejemplo

**GET** http://190.221.146.245:8090/zap/cnrt/patente/FVO243

FVO243 es una patente que está habilitado en CNRT

## Api para consulta de CNRT por Chofer por medio de DNI

http://190.221.146.245:8090/zap/cnrt/chofer/

### Datos del Chofer

 * Documento
 * Nombre
 * Apellido
 * Fecha Revisión Original
 * Fecha Resolución
 * Categoria
 * Estado

### Ejemplo

http://190.221.146.245:8090/zap/cnrt/chofer/4159980

4159980 es un DNI que está habilitado en CNRT

## Api para consulta de Turno por medio de Número de Contenedor. Devuelve los turnos según el Contenedor

**GET** http://190.221.146.245:8090/zap/turno/contenedor/

### Datos del Turno

 * Buque
 * Viaje
 * Contenedor
 * Fecha Inicio
 * Fecha Fin
 * Movimiento
 * Fecha Alta
 * Usuario
 * disponibles_t1
 * Email
 * Fecha Verificación
 * Turno Verificación
 * Tipo Verificación
 * Terminal
 * hold
     * date
     * status

### Ejemplo

**GET** http://190.221.146.245:8090/zap/turno/contenedor/HASU1016369

## Listado de contenedores con turno activo del dia de hoy ZAP

**GET** http://190.221.146.245:8090/zap/turnos/contenedores

## Listado de camiones con turno activo del dia de hoy ZAP

**GET** http://190.221.146.245:8090/zap/turnos/camiones

## Insertar un Chofer

**POST** http://190.221.146.245:8090/zap/chofer
Content-Type: application/json

Parametros:
 * lastname
 * firstname
 * mobile

## Obtiene un chofer por dni

**GET** http://190.221.146.245:8090/zap/chofer/23250578
