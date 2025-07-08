<?php
namespace App\Controller\Api;

use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Attribute\Model;
use App\Entity\User;

#[Route('/api/user')]
#[OA\Tag(name: 'Users')]
class UserControllerApi extends AbstractController
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    #[Route('/me', name: 'api_user_me', methods: ['GET'])]
    #[OA\Get(
        path: '/api/user/me',
        summary: 'Récupère les données de l\'utilisateur connecté',
        tags: ['Users'],
        security: [['bearerAuth' => []]]
    )]
    #[OA\Response(
        response: 200,
        description: 'Données de l\'utilisateur connecté',
        content: new OA\JsonContent(ref: new Model(type: User::class, groups: ['user:read']))
    )]
    #[OA\Response(
        response: 401,
        description: 'Non autorisé - utilisateur non connecté',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'error', type: 'string', example: 'User not authenticated')
            ]
        )
    )]
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
