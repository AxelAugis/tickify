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
use Psr\Log\LoggerInterface;


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
        $connectedUser = $this->getUser();

        if (!$connectedUser) {
            return $this->json(['message' => 'User not found'], 404);
        }

        if (!$project) {
            return $this->json(['message' => 'Project not found'], 404);
        }

        $projectOwner = $project->getOwner();
        
        if($connectedUser !== $projectOwner) {
            return $this->json(['message' => 'You are not the owner of this project'], 403);
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

    #[Route('/check-duplicate', name: 'api_project_check_duplicate', methods: ['POST'])]
    public function checkDuplicate(Request $request, ProjectRepository $projectRepository, LoggerInterface $logger): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $name = $data['params']['projectName'] ?? null;
        $id = $data['params']['projectId'] ?? null;
        $userId = $data['params']['userId'] ?? null;

        if (!$name || !$userId) {
            return $this->json(['status' => 400, 'message' => 'Missing required parameters'], 400);
        }

        $existingProject = null;

        if (empty($id)) {
            // Création d'un nouveau projet : vérifier si un projet avec ce nom existe déjà pour cet utilisateur
            $existingProject = $projectRepository->findOneBy(['name' => $name, 'owner' => $userId]);
        } else {
            $queryBuilder = $projectRepository->createQueryBuilder('p');
            $existingProject = $queryBuilder
                ->where('p.name = :name')
                ->andWhere('p.owner = :userId')
                ->andWhere('p.id != :id')
                ->setParameter('name', $name)
                ->setParameter('userId', $userId)
                ->setParameter('id', $id)
                ->getQuery()
                ->getOneOrNullResult();
        }

        if ($existingProject) {
            return $this->json(['status' => 400, 'duplicate' => true], 400);
        }
        
        return $this->json(['status' => 200, 'duplicate' => false], 200);
    }
}
