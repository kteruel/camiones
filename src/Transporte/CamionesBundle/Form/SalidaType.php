<?php

namespace Transporte\CamionesBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\Extension\Core\Type\TextType;

class SalidaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('tractor_patente', TextType::class, [ 'label' => 'Patente (Tractor)'])
            ->add('chofer_dni', TextType::class, [ 'label' => 'Chofer (DNI)'])
            ->add('playo_patente', TextType::class, [ 'label' => 'Patente (Playo)'])
            ->add('contenedor', TextType::class, [ 'label' => 'Contenedor'])
        ;
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'transporte_camionesbundle_salida';
    }
}