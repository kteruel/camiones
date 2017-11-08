<?php

namespace Transporte\CoreBundle\Service;

class CurlService
{
    public function post($url, $data)
    {
        $query = http_build_query($data, '', '&');

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/x-www-form-urlencoded'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }

    public function get($url, $data = null, $header = null)
    {
        if ($data) {
            $query = http_build_query($data, '', '&');
            $url .= "?" . $query;
        }

        $curlHeader = array('Content-type: application/x-www-form-urlencoded');
        if ($header) {
            $curlHeader = array_merge($curlHeader, $header);
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $curlHeader);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }
}