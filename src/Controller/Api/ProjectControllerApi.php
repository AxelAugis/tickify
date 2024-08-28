<?php

namespace App\Controller\Api;

use App\Entity\Project;
use App\Repository\ProjectRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;

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
    public function getInfos(Project $project, LoggerInterface $logger): JsonResponse
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
                    'name' => $ticket->getTitle(),
                    'description' => $ticket->getDescription(),
                ];
            }
        }

        $data = [
            'project' => $project,
            'tickets' => $groupedTickets,
        ];

        return $this->json($data, 200, [], ['groups' => 'project:read']);
    }   
}
