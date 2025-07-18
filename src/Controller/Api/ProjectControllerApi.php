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

#[Route('/api/project')]
#[OA\Tag(name: 'Projects')]
class ProjectControllerApi extends AbstractController
{
    private Security $security;
    private LoggerInterface $logger;
    private CacheInterface $cache;
    private SerializerInterface $serializer;

    public function __construct(Security $security, LoggerInterface $logger, CacheInterface $cache, SerializerInterface $serializer)
    {
        $this->security = $security;
        $this->logger = $logger;
        $this->cache = $cache;
        $this->serializer = $serializer;
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
}
   