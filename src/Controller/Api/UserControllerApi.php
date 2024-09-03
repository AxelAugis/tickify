<?php
namespace App\Controller\Api;

use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/user')]
class UserControllerApi extends AbstractController
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    #[Route('/me', name: 'api_user_me', methods: ['GET'])]
    public function getUserData(): JsonResponse
    {
        try {
            $user = $this->userService->getUserData();
            return $this->json($user, 200, [], ['groups' => 'user:read']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 401);
        }
    }
}
