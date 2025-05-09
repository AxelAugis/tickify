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

class TicketControllerApi extends AbstractController
{
    #[Route('/api/ticket', name: 'api_ticket', methods: ['GET'])]
    public function index(TicketRepository $ticketRepository): JsonResponse
    {
        $tickets = $ticketRepository->findAll();

        return $this->json($tickets, 200, [], ['groups' => 'ticket:read']);
    }

    #[Route('/api/ticket/create', name: 'api_ticket_create', methods: ['POST'])]
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
    public function delete(Ticket $ticket, EntityManagerInterface $entityManager)
    {
        $entityManager->remove($ticket);
        $entityManager->flush();

        return new Response('', Response::HTTP_OK);
    }
}