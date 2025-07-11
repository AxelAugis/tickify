<?php

namespace App\Controller\Api;

use App\Entity\Master;
use App\Entity\Project;
use App\Entity\Team;
use App\Entity\User;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Attribute\Model;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Uid\Uuid;

#[Route('/api/project')]
#[OA\Tag(name: 'Projects')]
class ProjectControllerApi extends AbstractController
{
    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
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
        // get the connected user
        $connectedUser = $this->security->getUser();
        if (!$connectedUser) {
            return $this->json(['message' => 'User not found'], 404);
        }

        $createdAt = new \DateTimeImmutable();
        $updatedAt = new \DateTime();

        try {
            $data = json_decode($request->getContent(), true);

            // Create project
            $project = new Project();

            $project->setName($data['name']);
            $project->setDescription($data['description']);
            $project->setOwner($connectedUser);
            $project->setCreatedAt($createdAt);
            $project->setUpdatedAt($updatedAt);
            $project->setUuid(Uuid::v7());

            $entityManager->persist($project);
            $entityManager->flush();

            // Create teams for the projects with teams array
            $teams = $data['teams'] ?? [];
            foreach ($teams as $teamData) {
                $team = new Team();
                $team->setProject($project);
                $team->setName($teamData['name']);
                $team->setColor($teamData['color']);
                $team->setCreatedAt($createdAt);
                $team->setUpdatedAt($updatedAt);

                $entityManager->persist($team);
                $entityManager->flush();
            }

            // Create master branch if one is provided
            $branch = $data['branch'] ?? null;

            if ($branch) {
                $master= new Master();
                $master->setProject($project);
                $master->setTitle($branch['name']);
                $master->setDescription($branch['description'] ?? '');
                $master->setCreatedAt($createdAt);
                $master->setUpdatedAt($updatedAt);

                $entityManager->persist($master);
                $entityManager->flush();
            }

            return $this->json(['message' => 'Project created!', 'uuid' => $project->getUuid()], 201);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Error creating project: ' . $e->getMessage()], 500);
        }
    }

    #[Route('/{id}/delete', name: 'api_project_delete', methods: ['DELETE'])]
    public function delete(Project $project, EntityManagerInterface $entityManager): JsonResponse
    {
        $connectedUser = $this->security->getUser();
        if (!$connectedUser) {
            return $this->json(['message' => 'User not found'], 404);
        }

        if ($project->getOwner() !== $connectedUser) {
            return $this->json(['message' => 'Access denied'], 403);
        }

        $entityManager->remove($project);
        $entityManager->flush();

        return $this->json(['message' => 'Project deleted'], 204);
    }

    #[Route('/check-duplicate', name: 'api_project_check_duplicate', methods: ['POST'])]
    public function checkDuplicate(Request $request, ProjectRepository $projectRepository, LoggerInterface $logger): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $name = $data['params']['projectName'] ?? null;
        $id = $data['params']['projectId'] ?? null;
        $connectedUser = $this->security->getUser();

        if (!$name || !$connectedUser) {
            return $this->json(['status' => 400, 'message' => 'Missing required parameters'], 400);
        }

        $existingProject = null;

        if (empty($id)) {
            $existingProject = $projectRepository->findOneBy(['name' => $name, 'owner' => $connectedUser]);
        } else {
            $queryBuilder = $projectRepository->createQueryBuilder('p');
            $existingProject = $queryBuilder
                ->where('p.name = :name')
                ->andWhere('p.owner = :userId')
                ->andWhere('p.id != :id')
                ->setParameter('name', $name)
                ->setParameter('userId', $connectedUser)
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
