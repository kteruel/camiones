<?php

namespace Transporte\CamionesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/ingreso", name="camiones_ingreso")
     */
    public function camionesAction(Request $request)
    {
        $form = $this->createForm('Transporte\CamionesBundle\Form\IngresoType');

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // API para guardar los cambios
            $this->get('flashbag_service')->setFlash('success', 'Los cambios se han guardado correctamente');
        }

        return $this->render('CamionesBundle:Form:ingreso.html.twig', [
            'form' => $form->createView()
        ]);
    }
}