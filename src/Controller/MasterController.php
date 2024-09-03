<?php

namespace App\Controller;

use App\Entity\Master;
use App\Form\MasterType;
use App\Repository\MasterRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class MasterController extends AbstractController
{
    #[Route('/master', name: 'app_master')]
    public function index(MasterRepository $masterRepository): Response
    {
        $table = [
            'headers' => [
                [
                    'label' => 'ID'
                ],
                [
                    'label' => 'Titre'
                ],
                [
                    'label' => 'Description'
                ],
                [
                    'label' => 'Projet'
                ],
                [
                    'label' => 'Créé le'
                ],
                [
                    'label' => 'Actions'
                ]
            ]
        ];

        $content = [
            'title' => 'Master',
            'emptyData' => 'Vous n\'avez pas encore de masters...',
        ];

        $masters = $masterRepository->findAll();

        return $this->render('master/index.html.twig', [
            'controller_name' => 'MasterController',
            'masters' => $masters,
            'content' => $content,
            'table' => $table

        ]);
    }

    #[Route('/master/new', name: 'app_master_new')]
    public function create(Request $request, EntityManagerInterface $entityManager): Response
    {

        $content = [
            'title' => 'Nouveau master',
        ];

        $master = new Master();
        $form = $this->createForm(MasterType::class, $master);
        $form->handleRequest($request);

        $master->setCreatedAt(new \DateTimeImmutable());
        $master->setUpdatedAt(new \DateTime());

        if ($form->isSubmitted() && $form->isValid()) {

            $entityManager->persist($master);
            $entityManager->flush();

            return $this->redirectToRoute('app_master');
        }

        return $this->render('master/new.html.twig', [
            'controller_name' => 'MasterController',
            'form' => $form->createView(),
            'content' => $content
        ]);
    }

    #[Route('/master/{id}/edit', name: 'app_master_edit')]
    public function edit(Master $master, Request $request, EntityManagerInterface $entityManager): Response
    {
        $content = [
            'title' => 'Modifier le master',
        ];

        $form = $this->createForm(MasterType::class, $master);
        $form->handleRequest($request);

        $master->setUpdatedAt(new \DateTimeImmutable());

        if ($form->isSubmitted() && $form->isValid()) {

            $entityManager->flush();

            return $this->redirectToRoute('app_master');
        }

        return $this->render('master/edit.html.twig', [
            'controller_name' => 'MasterController',
            'form' => $form->createView(),
            'content' => $content
        ]);
    }

    #[Route('/master/{id}/delete', name: 'app_master_delete')]
    public function delete(Master $master, EntityManagerInterface $entityManager): Response
    {
        $entityManager->remove($master);
        $entityManager->flush();

        return $this->redirectToRoute('app_master');
    }
}
