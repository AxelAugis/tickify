<?php 

namespace App\Controller\Api;

use App\Config\TicketStatus;
use App\Entity\Ticket;
use App\Repository\TicketRepository;
use Doctrine\ORM\EntityManagerInterface;
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

    #[Route('/api/ticket', name: 'api_ticket_new', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $ticket = new Ticket();
        $ticket->setTitle($data['title']);
        $ticket->setDescription($data['description']);
        $ticket->setProject($data['project']);
        $ticket->setStatus($data['status']);

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
}