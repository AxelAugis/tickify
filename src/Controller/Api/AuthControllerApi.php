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

#[Route('/api/auth', name: 'api_auth_')]
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
    public function getFrontUser(): JsonResponse
    {
        $user = $this->security->getUser();
        if(!$user) {
            return new JsonResponse(['success' => false, 'message' => 'User not found'], 404);
        }

        return $this->json($user, 200, [], ['groups' => 'user:read']);
    }

}