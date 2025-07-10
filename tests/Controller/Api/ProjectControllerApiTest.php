<?php

namespace App\Tests\Controller\Api;

use App\Entity\Project;
use App\Entity\User;
use App\Entity\Team;
use App\Entity\Master;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class ProjectControllerApiTest extends WebTestCase
{
    private $client;
    private $entityManager;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = $this->client->getContainer()->get('doctrine')->getManager();
    }

    public function testCreateProjectViaApi(): void
    {
        // Get user from loaded fixtures
        $user = $this->entityManager->getRepository(User::class)->find(1);
        $this->assertNotNull($user, 'L\'utilisateur avec l\'ID 1 doit exister dans les fixtures');

        // Simulate user login
        $this->client->loginUser($user);

        // Datas
        $projectData = [
            'name' => 'Projet API Test',
            'description' => 'Test de création de projet via API',
            'teams' => [
                [
                    'name' => 'Frontend',
                    'color' => '#FF5733'
                ],
                [
                    'name' => 'Backend',
                    'color' => '#33FF57'
                ]
            ],
            'branch' => [
                'name' => 'main',
                'description' => 'Branche principale du projet'
            ]
        ];

        // Request
        $this->client->request(
            'POST',
            '/api/project/create',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($projectData)
        );

        // Check response
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('message', $response);
        $this->assertArrayHasKey('uuid', $response);
        $this->assertEquals('Project created!', $response['message']);

        // Check creation in db
        $project = $this->entityManager->getRepository(Project::class)
            ->findOneBy(['name' => 'Projet API Test']);
        
        $this->assertNotNull($project);
        $this->assertEquals('Projet API Test', $project->getName());
        $this->assertEquals('Test de création de projet via API', $project->getDescription());
        $this->assertEquals($user, $project->getOwner());
        $this->assertNotNull($project->getUuid());

        // check teams creation
        $teams = $project->getTeams();
        $this->assertCount(2, $teams);
        
        $teamNames = [];
        foreach ($teams as $team) {
            $teamNames[] = $team->getName();
        }
        $this->assertContains('Frontend', $teamNames);
        $this->assertContains('Backend', $teamNames);

        // Check that the master branch was created
        $masters = $project->getMasters();
        $this->assertCount(1, $masters);
        $this->assertEquals('main', $masters->first()->getTitle());
        $this->assertEquals('Branche principale du projet', $masters->first()->getDescription());
    }

    public function testCreateProjectWithoutAuthentication(): void
    {
        $projectData = [
            'name' => 'Projet Non Autorisé',
            'description' => 'Ce projet ne devrait pas être créé'
        ];

        // Envoyer la requête sans authentification
        $this->client->request(
            'POST',
            '/api/project/create',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($projectData)
        );

        // Vérifier que l'accès est refusé à cause du JWT manquant
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals('JWT Token not found', $response['message']);
    }

    public function testCreateProjectWithMinimalData(): void
    {
        // Get user from loaded fixtures
        $user = $this->entityManager->getRepository(User::class)->find(1);
        $this->assertNotNull($user, 'L\'utilisateur avec l\'ID 1 doit exister dans les fixtures');

        // Simulate user login
        $this->client->loginUser($user);

        // Datas
        $projectData = [
            'name' => 'Projet Minimal',
            'description' => 'Description minimale'
        ];

        // Request
        $this->client->request(
            'POST',
            '/api/project/create',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($projectData)
        );

        // Check response
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        
        // Check that the project has been created without teams or branches
        $project = $this->entityManager->getRepository(Project::class)
            ->findOneBy(['name' => 'Projet Minimal']);
        
        $this->assertNotNull($project);
        $this->assertCount(0, $project->getTeams());
        $this->assertCount(0, $project->getMasters());
    }

    public function testCheckDuplicateProjectName(): void
    {
        // Retrieve the existing user with ID 1 from fixtures
        $user = $this->entityManager->getRepository(User::class)->find(1);
        $this->assertNotNull($user, 'The user with ID 1 must exist in the fixtures');

        // Create an existing project for this test
        $existingProject = new Project();
        $existingProject->setName('Projet Existant');
        $existingProject->setDescription('Description of the existing project');
        $existingProject->setOwner($user);
        $existingProject->setCreatedAt(new \DateTimeImmutable());
        $existingProject->setUpdatedAt(new \DateTime());
        $existingProject->setUuid('123e4567-e89b-12d3-a456-426614174000');
        
        $this->entityManager->persist($existingProject);
        $this->entityManager->flush();

        // Simulate user login
        $this->client->loginUser($user);

        // Simulate checking for duplicates
        $checkData = [
            'params' => [
                'projectName' => 'Projet Existant',
                'userId' => $user->getId()
            ]
        ];

        $this->client->request(
            'POST',
            '/api/project/check-duplicate',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($checkData)
        );

        // Check that the duplicate is detected
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals(400, $response['status']);
        $this->assertTrue($response['duplicate']);
    }

    // protected function tearDown(): void
    // {
    //     parent::tearDown();
        
    //     // Nettoyer la base de données de test
    //     $this->entityManager->close();
    //     $this->entityManager = null;
    // }
}