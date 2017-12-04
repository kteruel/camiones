<?php

namespace Transporte\CamionesBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

class IngresoType extends AbstractType
{
    public function __construct($tipoMovimiento, $tipoCarga)
    {
        $this->tipoMovimiento = $tipoMovimiento;
        $this->tipoCarga = $tipoCarga;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('tractor_patente', TextType::class, [ 'label' => 'Patente' ])
            ->add('chofer_dni', TextType::class, [ 'label' => 'Documento' ])
            ->add('playo_patente', TextType::class, [ 'label' => 'Patente' ])
            ->add('contenedor', TextType::class, [ 'label' => 'Contenedor' ])
            ->add('inicio', HiddenType::class) // Turno Inicio
            ->add('fin', HiddenType::class) // Turno Fin
            ->add('terminal', TextType::class, [ 'label' => 'Terminal' ])
            ->add('alta', HiddenType::class) // Alta Turno
            ->add('mov', ChoiceType::class, [
                'label' => 'Movimiento',
                'choices'  => array_flip($this->tipoMovimiento),
                'required' => false,
                'placeholder' => ' - Seleccione - '
            ])
            ->add('carga', ChoiceType::class, [
                'label' => 'Carga',
                'choices'  => array_flip($this->tipoCarga),
                'required' => false,
                'placeholder' => ' - Seleccione - '
            ])
        ;
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'transporte_camionesbundle_ingreso';
    }
}