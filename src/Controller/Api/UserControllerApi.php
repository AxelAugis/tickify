<?php
namespace App\Controller\Api;

use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Attribute\Model;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api/user')]
#[OA\Tag(name: 'Users')]
class UserControllerApi extends AbstractController
{
    private UserService $userService;
    private UserPasswordHasherInterface $passwordHasher;
    private EntityManagerInterface $manager;

    public function __construct(UserService $userService, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $manager)
    {
        $this->userService = $userService;
        $this->passwordHasher = $passwordHasher;
        $this->manager = $manager;
    }

    // #[Route('/me', name: 'api_user_me', methods: ['GET'])]
    // #[OA\Get(
    //     path: '/api/user/me',
    //     summary: 'Récupère les données de l\'utilisateur connecté',
    //     tags: ['Users'],
    //     security: [['bearerAuth' => []]]
    // )]
    // #[OA\Response(
    //     response: 200,
    //     description: 'Données de l\'utilisateur connecté',
    //     content: new OA\JsonContent(ref: new Model(type: User::class, groups: ['user:read']))
    // )]
    // #[OA\Response(
    //     response: 401,
    //     description: 'Non autorisé - utilisateur non connecté',
    //     content: new OA\JsonContent(
    //         properties: [
    //             new OA\Property(property: 'error', type: 'string', example: 'User not authenticated')
    //         ]
    //     )
    // )]
    // public function getUserData(): JsonResponse
    // {
    //     try {
    //         $user = $this->userService->getUserData();
    //         return $this->json($user, 200, [], ['groups' => 'user:read']);
    //     } catch (\Exception $e) {
    //         return new JsonResponse(['error' => $e->getMessage()], 401);
    //     }
    // }

    #[Route('/register', name: 'api_user_register', methods: ['POST'])]
    public function registerUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $user = new User();
            $user->setLastname($data['lastname']);
            $user->setFirstname($data['firstname']);
            $user->setEmail($data['email']);
            $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
            $user->setRoles(['ROLE_USER']);
            $user->setCreatedAt(new \DateTimeImmutable());
            $user->setUpdatedAt(new \DateTime());

            $this->manager->persist($user);
            $this->manager->flush();

            return new JsonResponse([
                'success' => true,
            ], 201);
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'error' => $e->getMessage()
            ], 400);
        }

        
    }

    #[Route('/check-email-duplication', name: 'api_user_check_email', methods: ['POST'])]
    public function checkDuplicateEmail(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        if (!$email) {
            return new JsonResponse(['success' => false, 'message' => 'Email is required'], 400);
        }

        $exists = $this->userService->checkDuplicateEmail($email);

        return new JsonResponse(['exists' => $exists]);
    }
}
