<?php

namespace App\Controller\Api;

use App\Entity\Project;
use App\Entity\User;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api/project')]
class ProjectControllerApi extends AbstractController
{

    #[Route('/all', name: 'api_project_all', methods: ['GET'])]
    public function getAll(ProjectRepository $projectRepository): JsonResponse
    {
        $projects = $projectRepository->findAll();

        return $this->json($projects, 200, [], ['groups' => 'all-project:read']);
    }

    #[Route('/{id}/get-infos', name: 'api_project_get_infos', methods: ['GET'])]
    public function getInfos(Project $project): JsonResponse
    {

        if (!$project) {
            return $this->json(['message' => 'Project not found'], 404);
        }

        $tickets = $project->getTickets();
        $groupedTickets = ['todo' => [], 'in_progress' => [], 'done' => [], 'closed' => []];

        foreach ($tickets as $ticket) {
            $status = $ticket->getStatus()->value;
        
            if (array_key_exists($status, $groupedTickets)) {
                $groupedTickets[$status][] = [
                    'id' => $ticket->getId(),
                    'title' => $ticket->getTitle(),
                    'description' => $ticket->getDescription(),
                    'status' => $ticket->getStatus()->value,
                ];
            }
        }

        $data = [
            'project' => $project,
            'tickets' => $groupedTickets,
        ];

        return $this->json($data, 200, [], ['groups' => 'project:read']);
    }
    
    #[Route('/create', name: 'api_project_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $project = new Project();

        $data = json_decode($request->getContent(), true);

        $user = $entityManager->getRepository(User::class)->find(2);


        $project->setName($data['name']);
        $project->setDescription($data['description']);
        $project->setOwner($user);
        $project->setCreatedAt(new \DateTimeImmutable());
        $project->setUpdatedAt(new \DateTimeImmutable());

        $entityManager->persist($project);
        $entityManager->flush();

        return $this->json(['message' => 'Project created!'], 201);

    }
}
