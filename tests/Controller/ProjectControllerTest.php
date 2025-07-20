<?php

namespace App\Tests\Controller;

use App\Entity\Project;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class ProjectControllerTest extends WebTestCase
{
    private $client;
    private $entityManager;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = $this->client->getContainer()->get('doctrine')->getManager();
    }

    public function testCreate(): void
    {
        // Get user form loaded fixtures
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'augisax@test.com']);
        $this->assertNotNull($user, 'L\'utilisateur avec l\'email augisax@test.com doit exister dans les fixtures');

        // Log the user as an admin
        $this->client->loginUser($user);

        $crawler = $this->client->request('GET', '/project/new');
        
        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1', 'Nouveau projet');

        // Remplir le formulaire
        $form = $crawler->selectButton('Créer')->form();
        $form['project[name]'] = 'Mon Projet Test';
        $form['project[description]'] = 'Description de test pour le projet';
        $form['project[owner]'] = $user->getId();
        $form['project[firstColor]'] = '#FF5733';
        $form['project[secondColor]'] = '#33FF57';

        // Soumettre le formulaire
        $this->client->submit($form);

        // Vérifier la redirection après création
        $this->assertResponseRedirects('/project');

        // Suivre la redirection
        $this->client->followRedirect();
        $this->assertResponseIsSuccessful();

        // Vérifier que le projet a été créé en base de données
        $project = $this->entityManager->getRepository(Project::class)
            ->findOneBy(['name' => 'Mon Projet Test']);
        
        $this->assertNotNull($project);
        $this->assertEquals('Mon Projet Test', $project->getName());
        $this->assertEquals('Description de test pour le projet', $project->getDescription());
        $this->assertEquals($user, $project->getOwner());
        $this->assertInstanceOf(\DateTimeImmutable::class, $project->getCreatedAt());
        $this->assertInstanceOf(\DateTime::class, $project->getUpdatedAt());
    }

    public function testCreateWithInvalidData(): void
    {
        // Récupérer l'utilisateur existant avec l'ID 1 depuis les fixtures
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'augisax@test.com']);
        $this->assertNotNull($user, 'L\'utilisateur avec l\'email augisax@test.com doit exister dans les fixtures');

        // Simuler la connexion de l'utilisateur
        $this->client->loginUser($user);

        // Accéder à la page de création de projet
        $crawler = $this->client->request('GET', '/project/new');

        // Remplir le formulaire avec des données invalides (nom vide)
        $form = $crawler->selectButton('Créer')->form();
        $form['project[name]'] = ''; // Nom vide
        $form['project[description]'] = 'Description valide';
        $form['project[owner]'] = $user->getId();

        // Soumettre le formulaire
        $this->client->submit($form);

        // Vérifier qu'on reste sur la même page (pas de redirection)
        $this->assertResponseIsSuccessful();

        // Vérifier qu'aucun projet n'a été créé
        $projectCount = $this->entityManager->getRepository(Project::class)
            ->count(['name' => '']);
        
        $this->assertEquals(0, $projectCount);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        
        // Nettoyer la base de données de test
        $this->entityManager->close();
        $this->entityManager = null;
    }
}
