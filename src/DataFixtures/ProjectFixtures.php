<?php

namespace App\DataFixtures;

use App\Entity\Project;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Uid\UuidV7;
use Psr\Log\LoggerInterface;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ProjectFixtures extends Fixture
{
    private $logger;
    private $passwordHasher;

    public function __construct(LoggerInterface $logger, UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
        $this->logger = $logger;
    }
    public function load(ObjectManager $manager): void
    {
        $project = new Project();
        $user = new User();

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            'password'
        );
        $user->setLastname('Augis');
        $user->setFirstname('Axel');
        $user->setEmail('augisax@test.com');
        $user->setRoles(['ROLE_USER', 'ROLE_ADMIN']);
        $user->setPassword($hashedPassword);
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setUpdatedAt(new \DateTime());

        $manager->persist($user);

        $project->setOwner($user);
        $project->setName('Tickame');
        $project->setDescription('Tickame is a project management tool designed to help teams collaborate');
        $project->setCreatedAt(new \DateTimeImmutable());
        $project->setUpdatedAt(new \DateTime());
        $project->setUuid(UuidV7::v7());
        $project->setFirstColor('#4A90E2');
        $project->setSecondColor('#50E3C2');
        $manager->persist($project);

        $manager->flush();
    }
}
