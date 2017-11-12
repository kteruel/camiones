<?php

namespace Transporte\CamionesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @Route("/ajax_mock")
 */
class AjaxMockController extends Controller
{
    /**
     * @Route("/buscar_tractor", name="buscar_tractor")
     * @Method("POST")
     */
    public function buscarTractorPorPatenteAction(Request $request)
    {
        $camiones = [
            'DDS971' => [
                'patente' => 'DDS971',
                'titular' => 'Kevin Gastón Teruel',
                'documento' => 34430831,
                'marca' => 'Volkswagen',
                'modelo' => 'Gol 1.0L MI PLUS 001',
                'tipo' => 'Sedan 3 ptas',
                'chasis' => '8AWZZZ377YA100765',
                'motor' => 'AFZ463940',
                'vencimiento' => '19/03/2014'
            ]
        ];

        $data = $request->request->all();

        if (isset($data['tractor_patente'])) {
            if (isset($camiones[$data['tractor_patente']])) {
                return new JsonResponse([
                    'status' => 'ok',
                    'data' => $camiones[$data['tractor_patente']]
                ]);
            } else {
                return new JsonResponse([
                    'status' => 'not_found'
                ]);
            }
        }

        return new JsonResponse([
            'status' => 'not_found'
        ]);
    }

    /**
     * @Route("/buscar_chofer", name="buscar_chofer")
     * @Method("POST")
     */
    public function buscarChoferPorDocumentoAction(Request $request)
    {
        $choferes = [
            '34430831' => [
                'nombre' => 'Kevin',
                'apellido' => 'Teruel',
                'nacimiento' => '09/04/1989',
                'documento' => 34430831,
                'nacionalidad' => 'Argentino'
            ]
        ];

        $data = $request->request->all();

        if (isset($data['chofer_dni'])) {
            if (isset($choferes[$data['chofer_dni']])) {
                return new JsonResponse([
                    'status' => 'ok',
                    'data' => $choferes[$data['chofer_dni']]
                ]);
            } else {
                return new JsonResponse([
                    'status' => 'not_found'
                ]);
            }
        }

        return new JsonResponse([
            'status' => 'not_found'
        ]);
    }

    /**
     * @Route("/buscar_playo", name="buscar_playo")
     * @Method("POST")
     */
    public function buscarPlayoPorPatenteAction(Request $request)
    {
        $playos = [
            'OOZ555' => [
                'data1' => 'Data 1',
                'data2' => 'Data 2'
            ]
        ];

        $data = $request->request->all();

        if (isset($data['playo_patente'])) {
            if (isset($playos[$data['playo_patente']])) {
                return new JsonResponse([
                    'status' => 'ok',
                    'data' => $playos[$data['playo_patente']]
                ]);
            } else {
                return new JsonResponse([
                    'status' => 'not_found'
                ]);
            }
        }

        return new JsonResponse([
            'status' => 'not_found'
        ]);
    }
}