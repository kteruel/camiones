<?php

namespace Transporte\CoreBundle\Service;

use Symfony\Component\HttpFoundation\Session\Session;

class ValidatorService
{
    protected $validator;

    public function __construct($validator)
    {
        $this->validator = $validator;
    }

    /**
     * Valida que el array hasheado tenga los parametros correspondientes.
     *
     * @param  [] $parameters         Parametros que recibe por Request
     * @param  [] $parameterValids Parametros que tiene que recibir.
     *
     * @return boolean
     */
    public function validateParameters($parameters, $parameterValids)
    {
        foreach ($parameterValids as $validateParameterKey => $validateParameterValue) {
            if (is_array($validateParameterValue)) {
                foreach ($validateParameterValue as $validSubParameterKey => $validSubParameterArray) {
                    foreach($validSubParameterArray as $validSubParameterValue) {
                        if (!isset($parameters[$validSubParameterKey][$validSubParameterValue])) {
                            return "The parameter '$validSubParameterValue' in array '$validSubParameterKey' should not be blank.";
                        }
                    }
                }
            } else {
                if (!isset($parameters[$validateParameterValue])) {
                    return "The parameter '$validateParameterValue' should not be blank.";
                }
            }
        }

        return true;
    }

    /**
     * Valida que los parametros tengan un valor y no esté en blanco.
     *
     * @param  []  $parameters
     *
     * @return boolean|string
     */
    public function isValid($object, $group = null)
    {
        $errors = $this->validator->validate($object, null, $group);

        if (count($errors) > 0) {
            return $errors[0]->getMessage();
        }

        return true;
    }

}