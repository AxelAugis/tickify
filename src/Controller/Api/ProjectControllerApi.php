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

    #[Route('/user/{id}/all', name: 'api_project_all', methods: ['GET'])]
    #[OA\Get(
        path: '/api/project/user/{id}/all',
        summary: 'Récupère tous les projets d\'un utilisateur',
        tags: ['Projects']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID de l\'utilisateur',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(
        response: 200,
        description: 'Liste des projets de l\'utilisateur',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: Project::class, groups: ['all-project:read']))
        )
    )]
    #[OA\Response(
        response: 401,
        description: 'Token d\'authentification manquant ou invalide'
    )]
    public function getAll(User $user): JsonResponse
    {
        $projects = $user->getProjects();

        return $this->json($projects, 200, [], ['groups' => 'all-project:read']);
    }

    #[Route('/{id}/get-infos', name: 'api_project_get_infos', methods: ['GET'])]
    #[OA\Get(
        path: '/api/project/{id}/get-infos',
        summary: 'Récupère les informations détaillées d\'un projet avec ses tickets',
        tags: ['Projects']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID du projet',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(
        response: 200,
        description: 'Informations du projet avec tickets groupés par statut',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'project', ref: new Model(type: Project::class, groups: ['project:read'])),
                new OA\Property(
                    property: 'tickets',
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'todo', type: 'array', items: new OA\Items(type: 'object')),
                        new OA\Property(property: 'in_progress', type: 'array', items: new OA\Items(type: 'object')),
                        new OA\Property(property: 'done', type: 'array', items: new OA\Items(type: 'object'))
                    ]
                )
            ]
        )
    )]
    #[OA\Response(
        response: 401,
        description: 'Token d\'authentification manquant ou invalide'
    )]
    #[OA\Response(
        response: 403,
        description: 'Accès refusé - vous n\'êtes pas le propriétaire du projet'
    )]
    #[OA\Response(
        response: 404,
        description: 'Projet ou utilisateur non trouvé'
    )]
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
    #[OA\Post(
        path: '/api/project/create',
        summary: 'Crée un nouveau projet',
        tags: ['Projects']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name', 'description', 'id'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Mon nouveau projet'),
                new OA\Property(property: 'description', type: 'string', example: 'Description du projet'),
                new OA\Property(property: 'id', type: 'integer', example: 1, description: 'ID du propriétaire'),
                new OA\Property(
                    property: 'teams',
                    type: 'array',
                    items: new OA\Items(
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'name', type: 'string', example: 'Équipe A'),
                            new OA\Property(property: 'color', type: 'string', example: '#FF5733')
                        ]
                    )
                ),
                new OA\Property(
                    property: 'branch',
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'name', type: 'string', example: 'main'),
                        new OA\Property(property: 'description', type: 'string', example: 'Branche principale du projet')
                    ],
                    description: 'Branche principale du projet (optionnelle)'
                )
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Projet créé avec succès',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Project created!')
            ]
        )
    )]
    #[OA\Response(
        response: 401,
        description: 'Token d\'authentification manquant ou invalide'
    )]
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

    #[Route('/{id}/get-contexts', name: 'api_project_get_contexts', methods: ['GET'])]
    #[OA\Get(
        path: '/api/project/{id}/get-contexts',
        summary: 'Récupère les contextes d\'un projet',
        tags: ['Projects']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID du projet',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(
        response: 200,
        description: 'Liste des contextes du projet',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(type: 'object')
        )
    )]
    #[OA\Response(
        response: 401,
        description: 'Token d\'authentification manquant ou invalide'
    )]
    public function getContexts(Project $project): JsonResponse
    {
        $contexts = $project->getContexts();

        return $this->json($contexts, 200, [], ['groups' => 'context:read']);
    }

    #[Route('/check-duplicate', name: 'api_project_check_duplicate', methods: ['POST'])]
    #[OA\Post(
        path: '/api/project/check-duplicate',
        summary: 'Vérifie si un nom de projet existe déjà pour un utilisateur',
        tags: ['Projects']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['params'],
            properties: [
                new OA\Property(
                    property: 'params',
                    type: 'object',
                    required: ['projectName', 'userId'],
                    properties: [
                        new OA\Property(property: 'projectName', type: 'string', example: 'Mon projet'),
                        new OA\Property(property: 'userId', type: 'integer', example: 1),
                        new OA\Property(property: 'projectId', type: 'integer', example: 1, description: 'ID du projet (pour modification)')
                    ]
                )
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Vérification effectuée',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'status', type: 'integer', example: 200),
                new OA\Property(property: 'duplicate', type: 'boolean', example: false)
            ]
        )
    )]
    #[OA\Response(
        response: 400,
        description: 'Nom en double ou paramètres manquants',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'status', type: 'integer', example: 400),
                new OA\Property(property: 'duplicate', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Missing required parameters')
            ]
        )
    )]
    #[OA\Response(
        response: 401,
        description: 'Token d\'authentification manquant ou invalide'
    )]

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
}
