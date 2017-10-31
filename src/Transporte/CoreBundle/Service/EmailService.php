<?php

namespace Transporte\CoreBundle\Service;

class EmailService
{
    private $mailer;

    public function __construct($mailer)
    {
        $this->mailer = $mailer;
    }

    public function sendEmail($parameters)
    {
        $message = \Swift_Message::newInstance()
            ->setSubject($parameters['subject'])
            ->setFrom($parameters['from'])
            ->setTo($parameters['to'])
            ->setBody($parameters['body'], 'text/html')

        ;
        $this->mailer->send($message);
    }

}