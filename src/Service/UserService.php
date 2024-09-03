<?php

namespace App\Service;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Psr\Log\LoggerInterface;

class UserService
{
    private TokenStorageInterface $tokenStorage;
    private LoggerInterface $logger;

    public function __construct(TokenStorageInterface $tokenStorage, LoggerInterface $logger)
    {
        $this->tokenStorage = $tokenStorage;
        $this->logger = $logger;
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
}
