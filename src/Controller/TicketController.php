<?php

namespace App\Controller;

use App\Entity\Ticket;
use App\Form\TicketType;
use App\Repository\TicketRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TicketController extends AbstractController
{
    #[Route('/ticket', name: 'app_ticket')]
    public function index(TicketRepository $ticketRepository): Response
    {
        $table = [
            'headers' => [
                [
                    'label' => 'ID'
                ],
                [
                    'label' => 'Titre'
                ],
                [
                    'label' => 'Description'
                ],
                [
                    'label' => 'Projet'
                ],
                [
                    'label' => 'Statut'
                ],
                [
                    'label' => 'Actions'
                ]
            ]
        ];

        $tickets = $ticketRepository->findAll();

        $content = [
            'title' => 'Tickets',
            'emptyData' => 'Vous n\'avez pas encore de tickets...',
        ];
        
        return $this->render('ticket/index.html.twig', [
            'controller_name' => 'TicketController',
            'tickets' => $tickets,
            'content' => $content,
            'table' => $table
        ]);
    }

    #[Route('/ticket/new', name: 'app_ticket_new')]
    public function create(Request $request, EntityManagerInterface $entityManager): Response
    {

        $content = [
            'title' => 'Nouveau ticket',
        ];

        $ticket = new Ticket();
        $form = $this->createForm(TicketType::class, $ticket);
        $form->handleRequest($request);

        $ticket->setCreatedAt(new \DateTime());
        $ticket->setUpdatedAt(new \DateTime());

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($ticket);
            $entityManager->flush();

            return $this->redirectToRoute('app_ticket');
        }

        return $this->render('ticket/new.html.twig', [
            'controller_name' => 'TicketController',
            'form' => $form->createView(),
            'content' => $content
        ]);
    }

    #[Route('/ticket/edit/{id}', name: 'app_ticket_edit')]
    public function edit(Request $request, EntityManagerInterface $entityManager, Ticket $ticket): Response
    {
        $content = [
            'title' => 'Modifier le ticket',
        ];

        $form = $this->createForm(TicketType::class, $ticket);
        $form->handleRequest($request);

        $ticket->setUpdatedAt(new \DateTime());

        if ($form->isSubmitted() && $form->isValid()) {

            $entityManager->flush();

            return $this->redirectToRoute('app_ticket');
        }

        return $this->render('ticket/edit.html.twig', [
            'controller_name' => 'TicketController',
            'form' => $form->createView(),
            'content' => $content
        ]);
    }

    #[Route('/ticket/delete/{id}', name: 'app_ticket_delete')]
    public function delete(Ticket $ticket, EntityManagerInterface $entityManager): Response
    {
        $entityManager->remove($ticket);
        $entityManager->flush();

        return $this->redirectToRoute('app_ticket');
    }
}
