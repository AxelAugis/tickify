<?php

namespace App\Controller;

use App\Entity\Project;
use App\Form\ProjectType;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Uid\UuidV7;
use Symfony\Component\Validator\Constraints\DateTime;

class ProjectController extends AbstractController
{
    #[Route('/project', name: 'app_project')]
    public function index(ProjectRepository $projectRepository): Response
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
                    'label' => 'Description'
                ],
                [
                    'label' => 'Propriétaire'
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
            'title' => 'Projets',
            'emptyData' => 'Vous n\'avez pas encore de projets...',
        ];

        $projects = $projectRepository->findAll();

        return $this->render('project/index.html.twig', [
            'controller_name' => 'ProjectController',
            'projects' => $projects,
            'content' => $content,
            'table' => $table
        ]);
    }

    #[Route('/project/new', name: 'app_project_new')] 
    public function create(Request $request, EntityManagerInterface $entityManager): Response
    {

        $content = [
            'title' => 'Nouveau projet',
        ];

        $project = new Project();
        $form = $this->createForm(ProjectType::class, $project);
        $form->handleRequest($request);

        $project->setUuid(UuidV7::v7());
        $project->setCreatedAt(new \DateTimeImmutable());
        $project->setUpdatedAt(new \DateTime());

        if ($form->isSubmitted() && $form->isValid()) {

            $entityManager->persist($project);
            $entityManager->flush();

            return $this->redirectToRoute('app_project');
        }

        return $this->render('project/new.html.twig', [
            'controller_name' => 'ProjectController',
            'form' => $form->createView(),
            'content' => $content
        ]);
    }

    #[Route('/project/edit/{id}', name: 'app_project_edit')]
    public function edit(Project $project, Request $request, EntityManagerInterface $entityManager): Response
    {
        $content = [
            'title' => 'Modifier le projet',
        ];

        $form = $this->createForm(ProjectType::class, $project);
        $form->handleRequest($request);

        $project->setUpdatedAt(new \DateTime());

        if ($form->isSubmitted() && $form->isValid()) {

            $entityManager->flush();

            return $this->redirectToRoute('app_project');
        }

        return $this->render('project/edit.html.twig', [
            'controller_name' => 'ProjectController',
            'form' => $form->createView(),
            'content' => $content
        ]);
    }

    #[Route('/project/delete/{id}', name: 'app_project_delete')]
    public function delete(Project $project, EntityManagerInterface $entityManager): Response
    {
        $entityManager->remove($project);
        $entityManager->flush();

        return $this->redirectToRoute('app_project');
    }
    
}
