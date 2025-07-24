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
use OpenApi\Attributes as OA;
use Symfony\Bundle\SecurityBundle\Security;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Uid\Uuid;
use App\Service\Cache\ProjectCacheService;

#[Route('/api/project')]
#[OA\Tag(name: 'Projects')]
class ProjectControllerApi extends AbstractController
{
    private Security $security;
    private LoggerInterface $logger;
    private CacheInterface $cache;
    private SerializerInterface $serializer;
    private ProjectCacheService $projectCacheService;

    public function __construct(Security $security, LoggerInterface $logger, CacheInterface $cache, SerializerInterface $serializer, ProjectCacheService $projectCacheService)
    {
        $this->security = $security;
        $this->logger = $logger;
        $this->cache = $cache;
        $this->serializer = $serializer;
        $this->projectCacheService = $projectCacheService;
    }


    #[Route('/get-infos', name: 'api_project_get_infos', methods: ['GET'])]
    public function getDetails(Request $request, ProjectRepository $projectRepository): JsonResponse
    {
        $uuid = $request->query->get('uuid');
        $hashedUI = hash('sha256', $this->getUser()->getUserIdentifier());
        $cacheKey = 'project_' . $uuid. '_user_' . $hashedUI;

        try {
            $projectData = $this->cache->get($cacheKey, function (ItemInterface $item) use ($projectRepository, $uuid) {
                $item->expiresAfter(7200);

                // Get the project by UUID
                $project = $projectRepository->findOneBy(['uuid' => $uuid]);
                if (!$project) {
                    throw new \Exception('Project not found', 404);
                }

                $connectedUser = $this->security->getUser();
                if (!$connectedUser) {
                    throw new \Exception('User not found', 404);
                }

                // Check if the user is the owner
                if ($connectedUser !== $project->getOwner()) {
                    throw new \Exception('You are not the owner of this project', 403);
                }

                // Serialize the project with the project:read group (includes tickets)
                return $this->serializer->serialize($project, 'json', ['groups' => ['project:read']]);
            });

            return new JsonResponse([
                'message' => 'Project details fetched successfully',
                'project' => json_decode($projectData, true)
            ], 200);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Error fetching project details: ' . $e->getMessage()], $e->getCode() ?: 500);
        }
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
            $project->setFirstColor($data['first_color'] ?? '#3498db');
            $project->setSecondColor($data['second_color'] ?? '#2ecc71');

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
            $branch = $data['branch'] && $data['branch']['name'] ?? null;

            if ($branch) {
                $master= new Master();
                $master->setProject($project);
                $master->setTitle($branch['name']);
                $master->setDescription($branch['description'] ?? '');
                $master->setCreatedAt($createdAt);
                $master->setUpdatedAt($updatedAt);

                $entityManager->persist($master);
            }

            // Update the project list cache
            $hashedUi = hash('sha256', $connectedUser->getUserIdentifier());
            $this->projectCacheService->updateProjectListCache($hashedUi, $project);

            $entityManager->flush();

            return $this->json(['message' => 'Project created!', 'uuid' => $project->getUuid()], 201);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Error creating project: ' . $e->getMessage()], 500);
        }
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
            // Création d'un nouveau projet : vérifier si un projet avec ce nom existe déjà pour cet utilisateur
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

    #[Route('/{id}/delete', name: 'api_project_delete', methods: ['DELETE'])]
    public function delete(Request $request, EntityManagerInterface $entityManager, ProjectRepository $projectRepository, Project $project): JsonResponse
    {
        try {
            $connectedUser = $this->security->getUser();

            if (!$connectedUser) {
                return $this->json(['message' => 'User not found'], 404);
            }

                if (!$project) {
                return $this->json(['message' => 'Project not found'], 404);
            }

            $hashedUi = hash('sha256', $connectedUser->getUserIdentifier());
            $this->projectCacheService->deleteProjectFromCache($hashedUi, $project);

            $entityManager->remove($project);
            $entityManager->flush();

            return $this->json(['message' => 'Project deleted'], 204);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Error deleting project: ' . $e->getMessage()], 500);
        }
    }

    #[Route('/tickets', name: 'api_project_get_tickets', methods: ['GET'])]
    public function getAllTickets(Request $request, ProjectRepository $projectRepository): JsonResponse
    {
        $uuid = $request->query->get('uuid');
        $project = $projectRepository->findOneBy(['uuid' => $uuid]);

        if (!$project) {
            return new JsonResponse(['message' => 'Project not found'], 404);
        }

        $tickets = $project->getTickets();
        if (!$tickets) {
            return new JsonResponse(['message' => 'No tickets found for this project'], 404);
        }

        return new JsonResponse($this->serializer->serialize($tickets, 'json', ['groups' => ['ticket:read']]), 200, [], true);
    }
}
