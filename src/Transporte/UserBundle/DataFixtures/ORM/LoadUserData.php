<?php

namespace Transporte\UserBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Transporte\UserBundle\Entity\User;

class LoadUserData extends AbstractFixture implements OrderedFixtureInterface, ContainerAwareInterface
{
    /**
     * @var ContainerInterface
     */
    private $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $manager)
    {
        $manipulator = $this->container->get('fos_user.util.user_manipulator');
        $inactive = false;
        $superadmin = true;
        $adminemail = $this->container->getParameter('admin_email');
        $manipulator->create('admin', 'admin', $adminemail, !$inactive, $superadmin);
    }

    public function getOrder()
    {
        return 1;
    }
}