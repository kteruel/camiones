<?php

namespace Transporte\UserBundle\Service;

use Doctrine\ORM\EntityManager;

class UserService
{
    protected $entityManager;

    protected $userRepository;

    protected $securityTokenStorage;

    protected $securityAuthorizationChecker;

    protected $user;

    protected $fileUploader;

    public function __construct(EntityManager $entityManager, $securityTokenStorage, $securityAuthorizationChecker, $fileUploader)
    {
        $this->entityManager = $entityManager;
        $this->userRepository = $this->entityManager->getRepository('UserBundle:User');
        $this->securityTokenStorage = $securityTokenStorage;
        $this->securityAuthorizationChecker = $securityAuthorizationChecker;
        if ($this->securityTokenStorage->getToken()) {
            $this->user = $this->securityTokenStorage->getToken()->getUser();
        }
        $this->fileUploader = $fileUploader;
    }

    public function getRandomPassword($length = 8)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    /**
     * Sube la foto del usuario
     *
     * @param  File $photo
     */
    public function uploadPhoto($photo)
    {
        if ($photo) {
            $fileName = $this->fileUploader->upload($photo, '/users', true);
            $this->user->setPhoto($fileName);
            $this->entityManager->persist($this->user);
            $this->entityManager->flush();
        }
    }
}