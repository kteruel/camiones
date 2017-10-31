Guía de instalación de Proyecto
===

## Getting Started

Está es una instalación simple de 3 pasos. Desarrollada en Symfony 3.3.

# Requisitos de instalación

* [Composer](http://getcomposer.org)
* [PHP7.0](https://secure.php.net/)

# Instalación

* **Paso 1**. Clonar el repositorio

        $ git clone git@github.com:kteruel/camiones.git

* **Paso 2**. Correr el siguiente comando para instalar todas las librerias

        $ composer install

     Parametros de instalación
    * **secret**: Clave aleatoria para diferentes proyectos de Symfony (Ingresar cualquier combinación de caracteres de más de 20 letras y números)

Terminada toda la instalación deberá ingresar al sistema y listo!

### Configuración de Servidor (En caso de que el sistema esté instalado en /var/www/)

    sudo chown www-data:www-data -R /var/www/camiones/web

    # Allow write Apache
    sudo chown www-data:www-data -R /var/www/camiones/var
    HTTPDUSER=$(ps axo user,comm | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1)
    sudo setfacl -dR -m u:"$HTTPDUSER":rwX -m u:$(whoami):rwX var
    sudo setfacl -R -m u:"$HTTPDUSER":rwX -m u:$(whoami):rwX var
