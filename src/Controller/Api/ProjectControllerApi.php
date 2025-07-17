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
use Symfony\Component\Uid\Uuid;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

#[Route('/api/project')]
#[OA\Tag(name: 'Projects')]
class ProjectControllerApi extends AbstractController
{
    private Security $security;
    private LoggerInterface $logger;
    private CacheInterface $cache;

    public function __construct(Security $security, LoggerInterface $logger, CacheInterface $cache)
    {
        $this->security = $security;
        $this->logger = $logger;
        $this->cache = $cache;
    }

    #[Route('/get-infos', name: 'api_project_get_infos', methods: ['GET'])]
    public function getDetails(Request $request, ProjectRepository $projectRepository): JsonResponse
    {

        $uuid = $request->query->get('uuid');
        try {
            $project = $projectRepository->findOneBy(['uuid' => $uuid]);

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

            return $this->json(['message' => 'Project details fetched successfully', 'project' => $project], 200, [], ['groups' => ['project:read']]);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Error fetching project details: ' . $e->getMessage()], 500);
        }
      
    }
}
   