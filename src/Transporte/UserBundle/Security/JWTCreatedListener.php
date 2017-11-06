<?php

namespace Transporte\UserBundle\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

/**
 * Class JWTCreatedListener
 * @package Transporte\UserBundle\Security
 *
 */
class JWTCreatedListener
{
    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        if (!($request = $event->getRequest())) {
            return;
        }

        $user = $event->getUser();
        $payload       = $event->getData();
        $payload['roles'] = $user->getRoles();

        $event->setData($payload);
    }
}