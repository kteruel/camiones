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

        return $this->render('CamionesBundle:Camiones:salida.html.twig', [
            'form' => $form->createView()
        ]);
    }
}