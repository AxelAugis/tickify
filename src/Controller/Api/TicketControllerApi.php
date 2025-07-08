<?php 

namespace App\Controller\Api;

use App\Config\TicketStatus;
use App\Entity\Context;
use App\Entity\Project;
use App\Entity\Ticket;
use App\Repository\TicketRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Attribute\Model;

#[OA\Tag(name: 'Tickets')]
class TicketControllerApi extends AbstractController
{
    #[Route('/api/ticket', name: 'api_ticket', methods: ['GET'])]
    #[OA\Get(
        path: '/api/ticket',
        summary: 'Récupère tous les tickets',
        tags: ['Tickets']
    )]
    #[OA\Response(
        response: 200,
        description: 'Liste de tous les tickets',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: Ticket::class, groups: ['ticket:read']))
        )
    )]
    public function index(TicketRepository $ticketRepository): JsonResponse
    {
        $tickets = $ticketRepository->findAll();

        return $this->json($tickets, 200, [], ['groups' => 'ticket:read']);
    }

    #[Route('/api/ticket/create', name: 'api_ticket_create', methods: ['POST'])]
    #[OA\Post(
        path: '/api/ticket/create',
        summary: 'Crée un nouveau ticket',
        tags: ['Tickets']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['title', 'description', 'project', 'context', 'status'],
            properties: [
                new OA\Property(property: 'title', type: 'string', example: 'Corriger le bug de connexion'),
                new OA\Property(property: 'description', type: 'string', example: 'Description détaillée du ticket'),
                new OA\Property(property: 'project', type: 'integer', example: 1, description: 'ID du projet'),
                new OA\Property(property: 'context', type: 'integer', example: 1, description: 'ID du contexte'),
                new OA\Property(property: 'status', type: 'string', enum: ['todo', 'in_progress', 'done'], example: 'todo')
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Ticket créé avec succès',
        content: new OA\JsonContent(ref: new Model(type: Ticket::class, groups: ['ticket:read']))
    )]
    public function create(Request $request, EntityManagerInterface $entityManager, LoggerInterface $logger): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $logger->info('Creating a new ticket', $data);

        $project = $entityManager->getRepository(Project::class)->find($data['project']);
        $context = $entityManager->getRepository(Context::class)->find($data['context']);
        $status = TicketStatus::from($data['status']);

        $ticket = new Ticket();
        $ticket->setTitle($data['title']);
        $ticket->setDescription($data['description']);
        $ticket->setProject($project);
        $ticket->setContext($context);
        $ticket->setStatus($status);
        $ticket->setCreatedAt(new \DateTime());
        $ticket->setUpdatedAt(new \DateTime());

        $entityManager->persist($ticket);
        $entityManager->flush();

        return $this->json($ticket, 201, [], ['groups' => 'ticket:read']);
    }

    #[Route('/api/ticket/{id}/edit', name: 'api_ticket_edit', methods: ['PUT'])]
    #[OA\Put(
        path: '/api/ticket/{id}/edit',
        summary: 'Modifie un ticket existant',
        tags: ['Tickets']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID du ticket',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'title', type: 'string', example: 'Nouveau titre'),
                new OA\Property(property: 'description', type: 'string', example: 'Nouvelle description'),
                new OA\Property(property: 'project', type: 'integer', example: 1, description: 'ID du projet'),
                new OA\Property(property: 'status', type: 'string', enum: ['todo', 'in_progress', 'done'], example: 'in_progress')
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Ticket modifié avec succès'
    )]
    #[OA\Response(
        response: 404,
        description: 'Ticket non trouvé'
    )]
    public function edit(Ticket $ticket, Request $request, EntityManagerInterface $entityManager)
    {
        $data = json_decode($request->getContent(), true);

        if(isset($data['title'])) {
            $ticket->setTitle($data['title']);
        } 
        if (isset($data['description'])) {
            $ticket->setDescription($data['description']);
        } 
        if (isset($data['project'])) {
            $ticket->setProject($data['project']);
        } 
        if (isset($data['status'])) {
            $status = TicketStatus::from($data['status']);
            $ticket->setStatus($status);
        }

        $entityManager->flush();

        return new Response('', Response::HTTP_OK);
    }

    #[Route('/api/ticket/{id}/delete', name: 'api_ticket_delete', methods: ['DELETE'])]
    #[OA\Delete(
        path: '/api/ticket/{id}/delete',
        summary: 'Supprime un ticket',
        tags: ['Tickets']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID du ticket à supprimer',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(
        response: 200,
        description: 'Ticket supprimé avec succès'
    )]
    #[OA\Response(
        response: 404,
        description: 'Ticket non trouvé'
    )]
    public function delete(Ticket $ticket, EntityManagerInterface $entityManager)
    {
        $entityManager->remove($ticket);
        $entityManager->flush();

        return new Response('', Response::HTTP_OK);
    }
}