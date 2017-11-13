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

    /**
     * @Route("/buscar_turno", name="buscar_turno")
     * @Method("POST")
     */
    public function buscarTurnoAction(Request $request)
    {
        $data = $request->request->all();

        $parameters = [];
        if (isset($data['tractor_patente'])) {
            $parameters[] = [
                'key' => 'patente',
                'value' => $data['tractor_patente']
            ];
        }

        if (isset($data['contenedor'])) {
            $parameters[] = [
                'key' => 'contenedor',
                'value' => $data['contenedor']
            ];
        }

        $turnos = $this->buscarTurno($parameters);

        if (count($turnos) == 1) {
            return new JsonResponse([
                'status' => 'ok',
                'data' => $turnos[0]
            ]);
        } else {
            return new JsonResponse([
                'status' => 'not_found'
            ]);
        }

        return new JsonResponse([
            'status' => 'not_found'
        ]);
    }

    /**
     * @Route("/playa", name="playa")
     * @Method("GET")
     */
    public function playaAction()
    {
        $turnos = $this->getMockTurnos();

        return new JsonResponse([
            'status' => 'ok',
            'data' => $turnos
        ]);
    }

    /**
     * @Route(
     *     "/ver-turno",
     *     name="ver_turno",
     *     options={ "expose" = true }
     * )
     * @Method("GET")
     */
    public function verTurnoAction(Request $request)
    {
        $params = $request->query->all();
        $turnos = $this->buscarTurno([
            ['key' => 'patente', 'value' => $params['patente']],
            ['key' => 'fecha', 'value' => $params['fecha']]
        ]);

        $turno = count($turnos) == 1 ? $turnos[0] : null;

        return $this->render('CamionesBundle:Camiones:turno.html.twig', [
            'turno' => $turno
        ]);
    }

    private function getMockTurnos()
    {
        return [
            [
                'patente' => 'DDS971',
                'playo_patente' => 'OOZ555',
                'documento' => 34430831,
                'contenedor' => '123456',
                'terminal' => 'TRP',
                'operatoria' => 'IMPO',
                'fecha' => '12/11/2017 15:30'
            ],
            [
                'patente' => 'DDS971',
                'playo_patente' => 'ABC213',
                'documento' => 34430831,
                'contenedor' => '888888',
                'terminal' => 'TRP',
                'operatoria' => 'EXPO',
                'fecha' => '12/11/2017 20:00'
            ],
            [
                'patente' => 'ABC123',
                'playo_patente' => 'UJH684',
                'documento' => 88888888,
                'contenedor' => '9854785',
                'terminal' => 'BACTSSA',
                'operatoria' => 'IMPO',
                'fecha' => '12/11/2017 16:30'
            ],
            [
                'patente' => 'POK548',
                'playo_patente' => 'JHN658',
                'documento' => 44444444,
                'contenedor' => '541256',
                'terminal' => 'APM',
                'operatoria' => 'EXPO',
                'fecha' => '12/11/2017 16:00'
            ]
        ];
    }

    private function buscarTurno($parameters)
    {
        $turnos = $this->getMockTurnos();

        foreach ($parameters as $parameter) {
            $turnos_tmp = [];
            foreach ($turnos as $turno) {
                if ($turno[$parameter['key']] == $parameter['value']) {
                    $turnos_tmp[] = $turno;
                }
            }
            $turnos = $turnos_tmp;
        }

        return $turnos;
    }
}