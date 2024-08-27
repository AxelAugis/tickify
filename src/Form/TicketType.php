<?php

namespace App\Form;

use App\Config\TicketStatus;
use App\Entity\Project;
use App\Entity\Ticket;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TicketType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title')
            ->add('description')
            ->add('status', EnumType::class , [
                'class' => TicketStatus::class,
                'choice_label' => function ($choice, $key, $value) {
                    switch ($value) {
                        case 'todo':
                            return 'A faire';
                        case 'in_progress':
                            return 'En cours';
                        case 'done':
                            return 'Terminé';
                        default:
                            return 'Fermé';
                    }
                },
            ])
            ->add('project', EntityType::class, [
                'class' => Project::class,
                'choice_label' => 'name',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Ticket::class,
        ]);
    }
}
