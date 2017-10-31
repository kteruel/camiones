Guía de instalación de Proyecto
===

## Getting Started

Está es una instalación simple de 3 pasos. Desarrollada en Symfony 3.2 con base de datos PostgreSQL.

# Requisitos de instalación

* [Composer](http://getcomposer.org)
* [PostgreSQL](http://www.postgresql.org.es/)
* [PHP5.5](https://secure.php.net/)

# Instalación

* **Paso 1**. Clonar el repositorio

        $ git clone git@gitlab.transporte.com.ar:symfony/evnt.git

* **Paso 2**. Correr el siguiente comando para instalar todas las librerias

        $ composer install

     Parametros de instalación

    * **database_host**: Nombre/IP del Servidor (Default: 127.0.0.1 or localhost)
    * **database_port**: Puerto del Servidor (Default: null)
    * **database_name**: Nombre de la Base de datos (Default: symfony)
    * **database_user**: Usuario que se conecta a la Base de datos
    * **database_password**: Contraseña que utiliza el usuario
    * **mailer_transport**: Tipo de transporte de E-Mail
    * **mailer_host**: Nombre/IP del Servidor de envios de E-Mail
    * **mailer_user**: Usuario para conectarse al servidor de E-Mail (Si es requerido por el Servidor)
    * **mailer_password**: Contraseña para conectarse al servidor de E-Mail (Si es requerido por el Servidor)
    * **secret**: Clave aleatoria para diferentes proyectos de Symfony (Ingresar cualquier combinación de caracteres de más de 20 letras y números)

* **Paso 3**. Instalación de base de datos y usuario administrador. Antes deberá crear la base de datos desde el administrador de PostgreSQL con el mismo nombre que indico en el parametro 'database_name'

        $ app/console doctrine:schema:create
        $ app/console doctrine:fixtures:load

    El usuario y la contraseña del Administrador es:
    * **Usuario**: admin
    * **Contraseña**: admin

Terminada toda la instalación deberá ingresar al sistema y listo!

## Configuración Transporte

### Configuración de Sistema

* ** Configuración de Email **
    * **email:** evnt@transporte.com.ar
    * **contraseña:** transporte1q2w3e4r

* ** Configuración de GMaps **
    * **API Key:** AIzaSyB4lHIkKisOzDoG656bpMw1ilBiLrWYBgc

### Configuración de Servidor

* ** Configuración de Máquina Virtual **

    vi /etc/httpd/conf.d/event.conf

    <VirtualHost *:80>
        ServerName evnt.transporte.com.ar
        DirectoryIndex app.php
        DocumentRoot /var/www/evnt/web
        ErrorLog /var/log/httpd/evnt_error.log
        CustomLog /var/log/httpd/evnt_access.log combined
        <Directory /var/www/evnt/web>
            AllowOverride All
            Require all granted
        </Directory>
    </VirtualHost>

    sudo chown apache:apache -R /var/www/evnt/web/
    cd /var/www/evnt/web/uploads

    # File permissions, recursive
    find . -type f -exec chmod 0644 {} \;

    # Dir permissions, recursive
    find . -type d -exec chmod 0755 {} \;

    # SELinux serve files off Apache, resursive
    sudo chcon -t httpd_sys_content_t /var/www/evnt/web/uploads -R

    # Allow write only to specific dirs
    sudo chcon -t httpd_sys_rw_content_t /var/www/evnt/web/uploads -R
    sudo chcon -t httpd_sys_rw_content_t /var/www/evnt/web/uploads -R

    # Allow write Apache
    sudo chown apache:apache -R /var/www/evnt/var
    HTTPDUSER=$(ps axo user,comm | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1)
    sudo setfacl -dR -m u:"$HTTPDUSER":rwX -m u:$(whoami):rwX var
    sudo setfacl -R -m u:"$HTTPDUSER":rwX -m u:$(whoami):rwX var
