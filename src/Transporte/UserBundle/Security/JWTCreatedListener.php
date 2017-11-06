<?php

namespace Transporte\UserBundle\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Class JWTCreatedListener
 * @package Transporte\UserBundle\Security
 *
 * @DI\Service("project.listener.jwt_created")
 * @DI\Tag("kernel.event_listener", attributes = {
 *   "event" = "lexik_jwt_authentication.on_jwt_created", "method": "onJWTCreated"
 * })
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