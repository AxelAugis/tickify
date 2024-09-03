<?php

namespace App\Controller\Api;

use App\Entity\Project;
use App\Entity\User;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api/project')]
class ProjectControllerApi extends AbstractController
{

    #[Route('/user/{id}/all', name: 'api_project_all', methods: ['GET'])]
    public function getAll(User $user): JsonResponse
    {
        $projects = $user->getProjects();

        return $this->json($projects, 200, [], ['groups' => 'all-project:read']);
    }

    #[Route('/{id}/get-infos', name: 'api_project_get_infos', methods: ['GET'])]
    public function getInfos(Project $project): JsonResponse
    {

        if (!$project) {
            return $this->json(['message' => 'Project not found'], 404);
        }

        $tickets = $project->getTickets();
        $groupedTickets = ['todo' => [], 'in_progress' => [], 'done' => []];

        foreach ($tickets as $ticket) {
            $status = $ticket->getStatus()->value;
        
            if (array_key_exists($status, $groupedTickets)) {

                $context = $ticket->getContext();

                $contextArray = [
                    'id' => $context->getId(),
                    'name' => $context->getName(),
                    'color' => $context->getColor(),
                ];

                $groupedTickets[$status][] = [
                    'id' => $ticket->getId(),
                    'title' => $ticket->getTitle(),
                    'description' => $ticket->getDescription(),
                    'status' => $ticket->getStatus()->value,
                    'created_at' => $ticket->getCreatedAt(),
                    'context' => $contextArray,
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

        $user = $entityManager->getRepository(User::class)->find($data['id']);


        $project->setName($data['name']);
        $project->setDescription($data['description']);
        $project->setOwner($user);
        $project->setCreatedAt(new \DateTimeImmutable());
        $project->setUpdatedAt(new \DateTimeImmutable());

        $entityManager->persist($project);
        $entityManager->flush();

        return $this->json(['message' => 'Project created!'], 201);
    }

    #[Route('/{id}/get-contexts', name: 'api_project_get_contexts', methods: ['GET'])]
    public function getContexts(Project $project): JsonResponse
    {
        $contexts = $project->getContexts();

        return $this->json($contexts, 200, [], ['groups' => 'context:read']);
    }
}
