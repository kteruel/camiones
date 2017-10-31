<?php

namespace Transporte\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Ajax Profile Controller.
 *
 * @Route("/ajax/profile")
 */
class AjaxProfileController extends Controller
{
    /**
     * Upload photo into profile
     *
     * @Route("/upload-photo", name="profile_upload_photo")
     * @Method("POST")
     */
    public function ajaxUploadPhotoAction(Request $request)
    {
        $photo = $request->files->get('photo');

        $this->get('user_service')->uploadPhoto($photo);

        return new JsonResponse(['status' => 'ok']);
    }
}
