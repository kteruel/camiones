<?php

namespace Transporte\CamionesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class CamionesController extends Controller
{
    const API_URL_GATE = "http://190.221.146.245:8080/gate";

    /**
     * @Route("/ingreso", name="camiones_ingreso")
     */
    public function ingresoAction(Request $request)
    {
        $form = $this->createForm('Transporte\CamionesBundle\Form\IngresoType');

        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            $params = $request->request->all();
            $formData = $params['transporte_camionesbundle_ingreso'];
            if ($this->isFormIngresoValid($formData)) {
                // API para guardar los cambios
                $this->ingresoCamion($formData);
                $this->get('flashbag_service')->setFlash('success', 'Los cambios se han guardado correctamente');

                return $this->redirectToRoute('camiones_ingreso');
            }
        }

        return $this->render('CamionesBundle:Camiones:ingreso.html.twig', [
            'form' => $form->createView()
        ]);
    }

    private function ingresoCamion($formData)
    {
        $now = new \DateTime();
        $gateTimestamp = $now->format(\DateTime::ATOM);
        $camionJson = [
            'mov' => $formData['mov'],
            'tipo' => 'IN',
            'carga' => $formData['carga'],
            'contenedor' => $formData['contenedor'],
            'inicio'     => $formData['inicio'],
            'fin'     => $formData['fin'],
            'patenteCamion' => $formData['tractor_patente'],
            'gateTimestamp' => $gateTimestamp
        ];

        $this->get('curl.service')->post(self::API_URL_GATE, $camionJson, ['token' => $this->getUser()->getToken()]);

    }

    /** Valida si el Formulario de Ingreso es válido */
    private function isFormIngresoValid($formData)
    {
        if ($formData['tractor_patente'] == "") {
            $this->get('flashbag_service')->setFlash('error','Debe ingresar la Patente del Tractor');
            return false;
        }

        if ($formData['chofer_dni'] == "") {
            $this->get('flashbag_service')->setFlash('error','Debe ingresar el Documento del Chofer');
            return false;
        }

        if ($formData['playo_patente'] == "") {
            $this->get('flashbag_service')->setFlash('error','Debe ingresar la Patente del Playo');
            return false;
        }

        if ($formData['contenedor'] == "") {
            $this->get('flashbag_service')->setFlash('error','Debe ingresar Contenedor');
            return false;
        }

        if ($formData['mov'] == "") {
            $this->get('flashbag_service')->setFlash('error','Debe seleccionar un Tipo de Movimiento');
            return false;
        }

        if ($formData['carga'] == "") {
            $this->get('flashbag_service')->setFlash('error','Debe seleccionar un Tipo de Carga');
            return false;
        }

        if ($formData['inicio'] == "") {
            $this->get('flashbag_service')->setFlash('error','Debe seleccionar un Turno. Para seleccionar un turno debe consultar los turnos disponibles luego de ingresar la información solicitada.');
            return false;
        }

        return true;
    }

    /**
     * @Route("/playa", name="camiones_playa")
     */
    public function playaAction(Request $request)
    {
        return $this->render('CamionesBundle:Camiones:playa.html.twig');
    }

    /**
     * @Route("/salida", name="camiones_salida")
     */
    public function salidaAction(Request $request)
    {
        $form = $this->createForm('Transporte\CamionesBundle\Form\SalidaType');

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // API para guardar los cambios
            $this->get('flashbag_service')->setFlash('success', 'Los cambios se han guardado correctamente');
            return $this->redirectToRoute('camiones_salida');
        }

        return $this->render('CamionesBundle:Camiones:salida.html.twig', [
            'form' => $form->createView()
        ]);
    }
}