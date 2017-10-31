<?php

namespace Transporte\CoreBundle\Service;

use Symfony\Component\HttpFoundation\Session\Session;

class EncryptService
{
    public function encrypt($string, $key)
    {
        return  base64_encode( mcrypt_encrypt( MCRYPT_RIJNDAEL_256, md5( $key ), $q, MCRYPT_MODE_CBC, md5( md5( $key ) ) ) );
    }

    public function decrypt($string, $key)
    {
        return rtrim( mcrypt_decrypt( MCRYPT_RIJNDAEL_256, md5( $key ), base64_decode( $q ), MCRYPT_MODE_CBC, md5( md5( $key ) ) ), "\0");
    }
}