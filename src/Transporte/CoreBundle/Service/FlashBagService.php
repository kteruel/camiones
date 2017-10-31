<?php

namespace Transporte\CoreBundle\Service;

use Symfony\Component\HttpFoundation\Session\Session;

class FlashBagService
{
    private $session;

    public function __construct(Session $session)
    {
        $this->session = $session;
    }

    public function setFlash($index, $message)
    {
        if (!$this->hasError()) {
            $this->session->getFlashBag()->clear();
            $this->session->getFlashBag()->add($index,$message);
        }
    }

    public function setError($errors)
    {
        if (!$this->hasError()) {
            $this->session->getFlashBag()->clear();
            foreach ($errors as $error) {
                $this->session->getFlashBag()->add('error', $error->getMessage());
            }
        }
    }

    public function hasError()
    {
        return count($this->session->getFlashBag()->peek('error')) > 0;
    }

}