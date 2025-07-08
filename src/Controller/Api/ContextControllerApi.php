<?php

namespace App\Controller\Api;

use App\Entity\Context;
use App\Entity\Project;
use App\Entity\Team;
use App\Repository\ContextRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Attribute\Model;

#[Route('/api/context')]
#[OA\Tag(name: 'Contexts')]
class ContextControllerApi extends AbstractController
{

    #[Route('/all', name: 'api_context_all', methods: ['GET'])]
    #[OA\Get(
        path: '/api/context/all',
        summary: 'Récupère tous les contextes',
        tags: ['Contexts']
    )]
    #[OA\Response(
        response: 200,
        description: 'Liste de tous les contextes',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: Context::class, groups: ['all-context:read']))
        )
    )]
    public function getAll(ContextRepository $contextRepository): JsonResponse
    {
        $contexts = $contextRepository->findAll();

        return $this->json($contexts, 200, [], ['groups' => 'all-context:read']);
    }

    #[Route('/{id}/get-infos', name: 'api_context_get_infos', methods: ['GET'])]
    #[OA\Get(
        path: '/api/context/{id}/get-infos',
        summary: 'Récupère les informations d\'un contexte',
        tags: ['Contexts']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID du contexte',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(
        response: 200,
        description: 'Informations du contexte',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'context', ref: new Model(type: Context::class, groups: ['context:read']))
            ]
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'Contexte non trouvé'
    )]
    public function getInfos(Context $context): JsonResponse
    {

        if (!$context) {
            return $this->json(['message' => 'Context not found'], 404);
        }

        $data = [
            'context' => $context,
        ];

        return $this->json($data, 200, [], ['groups' => 'context:read']);
    }
    
    #[Route('/create', name: 'api_context_create', methods: ['POST'])]
    #[OA\Post(
        path: '/api/context/create',
        summary: 'Crée un nouveau contexte',
        tags: ['Contexts']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name', 'team', 'color'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Frontend'),
                new OA\Property(property: 'team', type: 'integer', example: 1, description: 'ID de l\'équipe'),
                new OA\Property(property: 'color', type: 'string', example: '#FF5733', description: 'Couleur du contexte en hexadécimal')
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Contexte créé avec succès',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Context created!')
            ]
        )
    )]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $team = $entityManager->getRepository(Team::class)->find($data['team']);


        $context = new Context();
        $context->setName($data['name']);
        $context->setTeam($team);
        $context->setColor($data['color']);

        $entityManager->persist($context);
        $entityManager->flush();

        return $this->json(['message' => 'Context created!'], 201);
    }
}