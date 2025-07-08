<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Attribute\Model;

#[Route('/api/auth', name: 'api_auth_')]
#[OA\Tag(name: 'Authentication')]
class AuthControllerApi extends AbstractController
{
    private $entityManager;
    private $passwordHasher;
    private $security;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, Security $security)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
        $this->security = $security;
    }

    #[Route('/check-user', name: 'check_user', methods: ['POST'])]
    #[OA\Post(
        path: '/api/auth/check-user',
        summary: 'Vérifie les informations d\'un utilisateur et l\'authentifie',
        tags: ['Authentication']
    )]
    #[OA\RequestBody(
        description: 'Informations de l\'utilisateur pour l\'authentification',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'email', type: 'string', example: 'myapp@hello.com', description: 'Email de l\'utilisateur'),
                new OA\Property(property: 'password', type: 'string', example: 'password123', description: 'Mot de passe de l\'utilisateur pour l\'authentification classique'),
            ]
        )
    )]
    // allow user to enter email and password or email and auth_method
    #[OA\Parameter(
        name: 'Email',
        in: 'query',
        required: true,
        description: 'Email de l\'utilisateur',
        schema: new OA\Schema(type: 'string', example: 'myapp@hello.com')
    )]
    #[OA\Parameter(
        name: 'password',
        in: 'query',
        required: true,
        description: 'Mot de passe de l\'utilisateur pour l\'authentification classique',
        schema: new OA\Schema(type: 'string', example: 'password123')
    )]
    #[OA\Response(
        response: 200,
        description: 'Utilisateur authentifié avec succès',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'User authenticated'),
                new OA\Property(property: 'token', type: 'string', example: 'jwt_token_here', description: 'JWT token pour auth classic')
            ]
        )
    )]
    #[OA\Response(
        response: 400,
        description: 'Mot de passe requis pour authentification classique'
    )]
    #[OA\Response(
        response: 403,
        description: 'Méthode d\'authentification ne correspond pas'
    )]
    #[OA\Response(
        response: 404,
        description: 'Utilisateur non trouvé'
    )]
    public function checkUser(Request $request, HttpClientInterface $httpClient)
    {
        $apiUrl = $this->getParameter('api.url');
        $data = json_decode($request->getContent(), true);
        $email = $data['email'];
        $authMethod = $data['auth_method'];

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['success' => false, 'message' => 'User not found'], 404);
        }

        if ($user->getAuthMethod() !== $authMethod) {
            return new JsonResponse(['success' => false, 'message' => 'Auth method mismatch'], 403);
        }

        if ($authMethod === 'classic') {
            $password = $data['password'] ?? null;

            if (!$password) {
                return new JsonResponse(['success' => false, 'message' => 'Password is required'], 400);
            }

            $response = $httpClient->request('POST', $apiUrl.'/api/login_check', [
                'json' => [
                    'username' => $email,
                    'password' => $password,
                ],
            ]);

            return new JsonResponse($response->toArray());

        }

        // Si tout est valide pour Google, simplement retourner un succès
        return new JsonResponse(['success' => true, 'message' => 'User authenticated']);
    }

    #[Route('/user', name: 'get_front_user', methods: ['GET'])]
    #[OA\Get(
        path: '/api/auth/user',
        summary: 'Récupère les informations de l\'utilisateur connecté',
        tags: ['Authentication'],
        security: [['bearerAuth' => []]]
    )]
    #[OA\Parameter(
        name: 'Authorization',
        in: 'header',
        required: true,
        description: 'Bearer token pour l\'authentification',
        schema: new OA\Schema(type: 'string', example: 'Bearer your_jwt_token_here')
    )]
    #[OA\Response(
        response: 200,
        description: 'Informations de l\'utilisateur connecté',
        content: new OA\JsonContent(ref: new Model(type: User::class, groups: ['user:read']))
    )]
    #[OA\Response(
        response: 404,
        description: 'Utilisateur non connecté ou non trouvé'
    )]
    public function getFrontUser(): JsonResponse
    {
        $user = $this->security->getUser();
        if(!$user) {
            return new JsonResponse(['success' => false, 'message' => 'User not found'], 404);
        }

        return $this->json($user, 200, [], ['groups' => 'user:read']);
    }

}