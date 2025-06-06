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

#[Route('/api/dashboard')]
class DashboardControllerApi extends AbstractController
{
    private $entityManager;
    private $security;
    private $userRepository;
    private $projectTicketService;

    public function __construct(
        EntityManagerInterface $entityManager, 
        Security $security, 
        UserRepository $userRepository,
        ProjectTicketService $projectTicketService
    ) {
        $this->entityManager = $entityManager;
        $this->security = $security;
        $this->userRepository = $userRepository;
        $this->projectTicketService = $projectTicketService;
    }

    #[Route('/projects/{userId}', methods: ['GET'])]
    public function getProjectsByUser(int $userId, ProjectRepository $projectRepository): JsonResponse
    {
        try {
            $connectedUser = $this->security->getUser();
        } catch (\Exception $e) {
            $connectedUser = null;
        }

        if ($connectedUser) {
            $user = $this->userRepository->findOneBy(['email' => $connectedUser->getUserIdentifier()]);
        }

        if(!$user || $user->getId() !== $userId) {
            return new JsonResponse(['message' => 'Unauthorized'], 403);
        }

        $projects = $projectRepository->findBy(['owner' => $user]);

        if (!$projects) {
            return new JsonResponse([]);
        }

        $projectsWithTickets = $this->projectTicketService->formatProjectsWithTicketCounts($projects);

        return $this->json($projectsWithTickets, 200, [], ['groups' => 'dashboard:project:read']);
    }
}