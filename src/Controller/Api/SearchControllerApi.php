<?php 

namespace App\Controller\Api;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

#[Route('/api/search')]
#[OA\Tag(name: 'Search')]
class SearchControllerApi extends AbstractController
{
    #[Route('/get-all', name: 'app_search_get_all', methods: ['GET'])]
    #[OA\Get(
        path: '/api/search/get-all',
        summary: 'Recherche globale dans les projets et tickets',
        tags: ['Search']
    )]
    #[OA\Parameter(
        name: 'term',
        description: 'Terme de recherche',
        in: 'query',
        required: true,
        schema: new OA\Schema(type: 'string', example: 'bug')
    )]
    #[OA\Response(
        response: 200,
        description: 'Résultats de recherche',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: 'projects',
                    type: 'array',
                    items: new OA\Items(
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'id', type: 'integer'),
                            new OA\Property(property: 'name', type: 'string'),
                            new OA\Property(property: 'url', type: 'string'),
                            new OA\Property(property: 'description', type: 'string')
                        ]
                    )
                ),
                new OA\Property(
                    property: 'tickets',
                    type: 'array',
                    items: new OA\Items(
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'id', type: 'integer'),
                            new OA\Property(property: 'title', type: 'string'),
                            new OA\Property(property: 'url', type: 'string'),
                            new OA\Property(property: 'description', type: 'string')
                        ]
                    )
                )
            ]
        )
    )]
    public function getAll(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {

        $data = [];
        $term = $request->query->get('term');

        if (empty($term)) {
            return new JsonResponse([]);
        }

        $projectQuery = $entityManager->createQuery(
            'SELECT p
            FROM App\Entity\Project p
            WHERE LOWER(p.name) LIKE LOWER(:term)'
        )->setParameter('term', '%' . $term . '%');

        $projects = $projectQuery->getResult();

        foreach ($projects as $project) {
            $data['projects'][] = [
                'id' => $project->getId(),
                'name' => $project->getName(),
                'url' => "/project/" . $project->getId(),
                'description' => $project->getDescription(),
            ];
        }

        $ticketQuery = $entityManager->createQuery(
            'SELECT t
            FROM App\Entity\Ticket t
            WHERE LOWER(t.title) LIKE LOWER(:term)'
        )->setParameter('term', '%' . $term . '%');

        $tickets = $ticketQuery->getResult();

        foreach ($tickets as $ticket) {
            $data['tickets'][] = [
                'id' => $ticket->getId(),
                'title' => $ticket->getTitle(),
                'url' => "/ticket/" . $ticket->getId(),
                'description' => $ticket->getDescription(),
            ];
        }

        return new JsonResponse($data);
    }
}