<?php

namespace Transporte\CamionesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class CamionesController extends Controller
{
    /**
     * @Route("/ingreso", name="camiones_ingreso")
     */
    public function ingresoAction(Request $request)
    {
        $form = $this->createForm('Transporte\CamionesBundle\Form\IngresoType');

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // API para guardar los cambios
            $this->get('flashbag_service')->setFlash('success', 'Los cambios se han guardado correctamente');

            return $this->redirectToRoute('camiones_ingreso');
        }

        return $this->render('CamionesBundle:Camiones:ingreso.html.twig', [
            'form' => $form->createView()
        ]);
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