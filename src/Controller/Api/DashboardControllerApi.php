<?php 

namespace App\Controller\Api;

use App\Repository\ProjectRepository;
use App\Repository\UserRepository;
use App\Service\ProjectTicketService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/dashboard')]
#[OA\Tag(name: 'Dashboard')]
class DashboardControllerApi extends AbstractController
{
    private $security;
    private $userRepository;
    private SerializerInterface $serializer;
    private ProjectTicketService $projectTicketService;
    private $cache;

    public function __construct(
        EntityManagerInterface $entityManager, 
        Security $security, 
        UserRepository $userRepository,
        ProjectTicketService $projectTicketService,
        SerializerInterface $serializer,
        CacheInterface $cache
    ) {
        $this->security = $security;
        $this->userRepository = $userRepository;
        $this->serializer = $serializer;
        $this->cache = $cache;
        $this->projectTicketService = $projectTicketService;
    }

    #[Route('/projects', methods: ['GET'])]
    #[OA\Get(
        path: '/api/dashboard/projects/{userId}',
        summary: 'Récupère les projets d\'un utilisateur avec le nombre de tickets',
        tags: ['Dashboard']
    )]
    #[OA\Parameter(
        name: 'userId',
        description: 'ID de l\'utilisateur',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(
        response: 200,
        description: 'Projets avec statistiques des tickets',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                type: 'object',
                properties: [
                    new OA\Property(property: 'id', type: 'integer'),
                    new OA\Property(property: 'name', type: 'string'),
                    new OA\Property(property: 'description', type: 'string'),
                    new OA\Property(property: 'ticketCounts', type: 'object', properties: [
                        new OA\Property(property: 'todo', type: 'integer'),
                        new OA\Property(property: 'in_progress', type: 'integer'),
                        new OA\Property(property: 'done', type: 'integer')
                    ])
                ]
            )
        )
    )]
    #[OA\Response(
        response: 403,
        description: 'Accès refusé - non autorisé'
    )]
    #[OA\Response(
        response: 404,
        description: 'Utilisateur non trouvé'
    )]
    public function getProjectsByUser(ProjectRepository $projectRepository): JsonResponse
    {
        $hashedUI = hash('sha256', $this->getUser()->getUserIdentifier());
        $cacheKey = 'dashboard_projects_user_' . $hashedUI;

        try {
            $projectsData = $this->cache->get($cacheKey, function (ItemInterface $item) use ($projectRepository) {
                $item->expiresAfter(7200);

                // Get the connected user
                $connectedUser = $this->security->getUser();
                if (!$connectedUser) {
                    throw new \Exception('User not found', 404);
                }

                // Find the user by email
                $user = $this->userRepository->findOneBy(['email' => $connectedUser->getUserIdentifier()]);
                if (!$user) {
                    throw new \Exception('User not found', 404);
                }

                $projects = $projectRepository->findBy(['owner' => $user]);

                if (!$projects) {
                    return new JsonResponse([], 200);
                }

                $projectsWithTickets = $this->projectTicketService->formatProjectsWithTicketCounts($projects);

                return $this->serializer->serialize($projectsWithTickets, 'json', ['groups' => 'project:read']);
            });

            return new JsonResponse(json_decode($projectsData, true), 200);

        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Error fetching projects: ' . $e->getMessage()], $e->getCode() ?: 500);
        }
    }
}