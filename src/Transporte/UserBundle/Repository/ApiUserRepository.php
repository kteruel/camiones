<?php

namespace Transporte\UserBundle\Repository;

use Transporte\CoreBundle\Service\CurlService;
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
     * @param string $apiURL
     *
     */
    public function __construct(LoggerInterface $logger, CurlService $curlService, TokenStorageInterface $securityTokenStorage, $apiURL)
    {
        $this->logger = $logger;
        $this->curlService = $curlService;
        $this->securityTokenStorage = $securityTokenStorage;
        $this->apiURL = $apiURL;
    }

    public function loginCheck($data)
    {
        try {
            $this->logger->debug('API call', ['data', $data]);
            return $this->curlService->post($this->apiURL . '/login', $data);
        } catch (\Exception $ex) {
            $response = $ex->getResponse();
            throw new HttpException($response->getStatusCode(), $ex->getMessage().'-'.$response->getReasonPhrase());
        }
    }
}