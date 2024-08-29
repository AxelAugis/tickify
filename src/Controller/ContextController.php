<?php

namespace App\Controller;

use App\Entity\Context;
use App\Form\ContextType;
use App\Repository\ContextRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ContextController extends AbstractController
{
    #[Route('/context', name: 'app_context')]
    public function index(ContextRepository $contextRepository): Response
    {

        $table = [
            'headers' => [
                [
                    'label' => 'ID'
                ],
                [
                    'label' => 'Nom'
                ],
                [
                    'label' => 'Projet'
                ],
                [
                    'label' => 'Couleur'
                ],
                [
                    'label' => 'Actions'
                ]
            ]
        ];

        $content = [
            'title' => 'Contextes',
            'emptyData' => 'Vous n\'avez pas encore de contextes...',
        ];

        $contexts = $contextRepository->findAll();

        return $this->render('context/index.html.twig', [
            'controller_name' => 'ContextController',
            'contexts' => $contexts,
            'table' => $table,
            'content' => $content
        ]);
    }

    #[Route('/context/new', name: 'app_context_new')]
    public function create(Request $request, EntityManagerInterface $entityManager): Response
    {
        $content = [
            'title' => 'Nouveau contexte',
            'emptyData' => 'Vous n\'avez pas encore de contexte...',
        ];

        $context = new Context();

        $form = $this->createForm(ContextType::class, $context);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($context);
            $entityManager->flush();

            return $this->redirectToRoute('app_context');
        }

        return $this->render('context/new.html.twig', [
            'controller_name' => 'ContextController',
            'form' => $form->createView(),
            'content' => $content
        ]);

        
    }

    #[Route('/context/{id}/edit', name: 'app_context_edit')]
    public function edit(Context $context, Request $request, EntityManagerInterface $entityManager): Response
    {
        $content = [
            'title' => 'Modifier le contexte',
        ];

        $form = $this->createForm(ContextType::class, $context);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_context');
        }

        return $this->render('context/edit.html.twig', [
            'controller_name' => 'ContextController',
            'form' => $form->createView(),
            'content' => $content
        ]);
    }

    #[Route('/context/{id}/delete', name: 'app_context_delete')]
    public function delete(Context $context, EntityManagerInterface $entityManager): Response
    {
        $entityManager->remove($context);
        $entityManager->flush();

        return $this->redirectToRoute('app_context');
    }
}
