<?php

namespace Transporte\UserBundle\Repository;

use Transporte\UserBundle\Security\ApiUser;
use Transporte\CoreBundle\Service\CurlService;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Security;

/**
 * Class ApiUserRepository.
 */
class ApiUserRepository
{
    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * @var CurlService
     */
    protected $curlService;

    /**
     * @var TokenStorageInterface
     */
    protected $securityTokenStorage;

    /**
     * BaseRepository constructor.
     * @param LoggerInterface $logger
     * @param CurlService $curlService
     * @param TokenStorageInterface $securityTokenStorage
     *
     */
    public function __construct(LoggerInterface $logger, CurlService $curlService, TokenStorageInterface $securityTokenStorage)
    {
        $this->logger = $logger;
        $this->curlService = $curlService;
        $this->securityTokenStorage = $securityTokenStorage;
    }

    public function loginCheck($data)
    {
        try {
            $this->logger->debug('API call', ['data', $data]);
            return $this->curlService->post('http://terminales.puertobuenosaires.gob.ar:8090/login', $data);
        } catch (RequestException $ex) {
            $response = $ex->getResponse();
            throw new HttpException($response->getStatusCode(), $ex->getMessage().'-'.$response->getReasonPhrase());
        }
    }

    /**
     * @param $url
     * @param bool $public
     * @return mixed
     */
    protected function getData($url, $public = true)
    {
        try {
            $this->logger->debug('API call with Guzzle', ['url', $url]);
            $client = $this->client->get();

            $options = [];

            $token = $this->getUserToken();
            if (null !== $token) {
                $options = array_merge_recursive(
                    $options,  [
                    'headers' => [
                        'Authorization' => sprintf('Bearer %s', $token),
                    ],
                ]);

                $url .= sprintf('?bearer=%s', $token);
            }

            return $client->get($url, $options);
        } catch (RequestException $ex) {
            $response = $ex->getResponse();
            throw new HttpException($response->getStatusCode(), $ex->getMessage().'-'.$response->getReasonPhrase());
        }
    }

    protected function getUserToken()
    {
        $user = $this->securityTokenStorage->getToken()->getUser();
        if (is_object($user) && $user instanceof ApiUser) {
            return $user->getToken();
        }

        return null;
    }
}