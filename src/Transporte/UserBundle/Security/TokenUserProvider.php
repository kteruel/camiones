<?php

namespace Transporte\UserBundle\Security;

use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\User\User;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;

/**
 * Token User Provider.
 */
class TokenUserProvider implements UserProviderInterface
{
    const JWT_TOKEN_PARTS_COUNT = 3;
    const TOKEN_REFRESH_DELAY = 120;

    /**
     * TokenUserProvider constructor.
     *
     * @param LoggerInterface $logger
     *
     */
    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function getUsernameForApiKey($username)
    {
        try {
            // TODO: Ver si se puede pedir un API que a partir de un token se obtiene el username
            return [
                $username,
                ['ROLE_USER']
            ];

        } catch (\Exception $ex) {
            $this->logger->error($ex->getMessage());
            throw new CustomUserMessageAuthenticationException('You have been disconnected, try to reconnect.');
        }
    }

    public function loadUserByUsername($username)
    {
        // NOT USED IN OUR CASE !!!
        return new ApiUser($username,  null, '', ['ROLE_USER'], '');
    }

    public function refreshUser(UserInterface $user)
    {
        if (!$user instanceof ApiUser) {
            throw new UnsupportedUserException(
                sprintf('Instances of "%s" are not supported.', get_class($user))
            );
        }

        list($username, $roles) = $this->getUsernameForApiKey($user->getUsername());

        return new ApiUser($username,  null, '', $roles, $user->getToken());
    }

    public function supportsClass($class)
    {
        return 'Transporte\UserBundle\Security\ApiUser' === $class;
    }
}