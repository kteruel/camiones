<?php

namespace Transporte\CoreBundle\EventListener;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;

use Transporte\CoreBundle\Entity\Document;
use Symfony\Component\HttpFoundation\File\File;
use Transporte\CoreBundle\Service\FileUploader;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;

class DocumentUploadListener
{
    private $uploader;

    private $tokenStorage;

    private $flashBagService;

    private $entityManager;

    public function __construct(FileUploader $uploader, TokenStorageInterface $tokenStorage, $flashBagService, $entityManager)
    {
        $this->uploader = $uploader;
        $this->tokenStorage = $tokenStorage;
        $this->flashBagService = $flashBagService;
        $this->entityManager = $entityManager;
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();

        if (!$entity instanceof Document) {
            return;
        }

        $user = $this->tokenStorage->getToken()->getUser();
        $entity->setCreatedBy($user);

        $this->uploadFile($entity);
    }

    public function preUpdate(PreUpdateEventArgs $args)
    {
        $entity = $args->getEntity();

        if (!$entity instanceof Document) {
            return;
        }

        $this->uploadFile($entity);
    }

    public function postLoad(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();

        if (!$entity instanceof Document) {
            return;
        }

        if ($fileName = $entity->getFile()) {
            $entity->setFile(new File($this->uploader->getTargetDir().'/documents/'.$fileName));
        }
    }

    public function postPersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();

        // only act on some "Document" entity
        if (!$entity instanceof Document) {
            return;
        }

        $entityManager = $args->getEntityManager();
        if ($this->flashBagService->hasError()) {
            $entityManager->remove($entity);
        }
    }

    private function uploadFile($entity)
    {
        // upload only works for Document entities
        if (!$entity instanceof Document) {
            return;
        }

        $file = $entity->getFile();

        // only upload new files
        if (!$file instanceof UploadedFile) {
            return;
        }

        try {
            $fileName = $this->uploader->upload($file, '/documents');
            $entity->setFile($fileName);
            $entity->setOriginalFileName($file->getClientOriginalName());
            $entity->setFileExtension($file->getClientOriginalExtension());
        } catch(FileNotFoundException $e) {
            $this->flashBagService->setFlash('error','Hubo un error en la subida del Documento. Por favor verifique que el Documento subido sea válido');
        }
    }
}