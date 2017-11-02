<?php

namespace Transporte\CoreBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        return $this->render("UserBundle:Default:index.html.twig");
    }

    /**
     * Render Menu and submenu from configuration bundles
     * The name of menu and submenu is required
     * If a menu has submenus you not have to have a direct path to direct the page
     */
    public function renderMenuAction($current_path)
    {
        $menuFactory = $this->get('menu.factory');

    	return $this->render('CoreBundle:Default:menu.html.twig', [
            'current_path' => $current_path,
            'menu' => $menuFactory->buildMenu()
        ]);
    }
}