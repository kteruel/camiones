<?php

namespace Transporte\CoreBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Transporte\CoreBundle\Entity\Document;

/**
 * Document controller.
 *
 * @Route("document")
 */
class DocumentController extends Controller
{
    /**
     * @Route("/download/{id}", name="document_download")
     */
    public function downloadAction(Document $document)
    {
        $content = file_get_contents($document->getWebRelativePathFile());

        $response = new Response();

        //set headers
        $response->headers->set('Content-Type', 'mime/type');
        $response->headers->set('Content-Disposition', 'attachment;filename="'.$document->getOriginalFileName());

        $response->setContent($content);
        return $response;
    }
}