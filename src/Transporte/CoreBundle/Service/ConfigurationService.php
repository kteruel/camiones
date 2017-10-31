<?php

namespace QC\CoreBundle\Service;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityNotFoundException;

use QC\EvntBundle\Entity\Configuration;

use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class ConfigurationService
{
    protected $entityManager;

    protected $configurationRepository;

    protected $user;

    public function __construct(EntityManager $entityManager, $securityTokenStorage)
    {
        $this->entityManager = $entityManager;
        $this->configurationRepository = $this->entityManager->getRepository('EvntBundle:Configuration');
        if ($securityTokenStorage->getToken()) {
            $this->user = $securityTokenStorage->getToken()->getUser();
        }
    }

    public function getConfiguration()
    {
        return $this->configurationRepository->findOneBy([
            'createdBy' => $this->user
        ]);
    }

    public function cloneConfiguration($user)
    {
        $conf = $this->configurationRepository->find(Configuration::DEFAULT_CONFIGURATION);

        if ($conf) {
            $newConf = clone $conf;
            $newConf->setCreatedBy($user);
            $newConf->setId($conf->getId() + 1);
            $this->entityManager->persist($newConf);
            $metadata = $this->entityManager->getClassMetaData(get_class($newConf));
            $metadata->setIdGeneratorType(\Doctrine\ORM\Mapping\ClassMetadata::GENERATOR_TYPE_NONE);
            $this->entityManager->flush();
        }
    }
}