<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Psr\Log\LoggerInterface;

class UserService
{
    private TokenStorageInterface $tokenStorage;
    private LoggerInterface $logger;
    private EntityManagerInterface $manager;

    public function __construct(TokenStorageInterface $tokenStorage, LoggerInterface $logger, EntityManagerInterface $manager)
    {
        $this->tokenStorage = $tokenStorage;
        $this->logger = $logger;
        $this->manager = $manager;
    }

    public function getUserData(): array
    {
        $token = $this->tokenStorage->getToken();
        $user = $token ? $token->getUser() : null;
        $this->logger->info('User data requested', ['user' => $user]);

        if (!$user instanceof UserInterface) {
            throw new \Exception('User not authenticated');
        }

        return [
            'user' => $user
        ];
    }

    public function checkDuplicateEmail(string $email): bool
    {
        $existingEmail = $this->manager->getRepository(User::class)->findOneBy(['email' => $email]);
        return $existingEmail !== null;
    }
}
