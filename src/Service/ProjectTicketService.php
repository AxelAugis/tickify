<?php

namespace App\Service;

use App\Entity\Project;
use Doctrine\Common\Collections\Collection;

class ProjectTicketService
{
    /**
     * Compte les tickets d'un projet par statut
     * 
     * @param Project $project
     * @return array
     */
    public function countTicketsByStatus(Project $project): array
    {
        $tickets = $project->getTickets();
        $ticketCounts = ['todo' => 0, 'in_progress' => 0, 'done' => 0];

        // Si il n'y a pas de tickets, on retourne les compteurs à 0
        if ($tickets->count() === 0) {
            return $ticketCounts;
        }

        foreach ($tickets as $ticket) {
            $status = $ticket->getStatus()->value;
            
            if (array_key_exists($status, $ticketCounts)) {
                $ticketCounts[$status]++;
            }
        }

        return $ticketCounts;
    }

    /**
     * Formate plusieurs projets avec le nombre de tickets par statut
     * 
     * @param array $projects
     * @return array
     */
    public function formatProjectsWithTicketCounts(array $projects): array
    {
        $projectsWithTickets = [];
        
        foreach ($projects as $project) {
            $projectData = [
                'id' => $project->getId(),
                'name' => $project->getName(),
                'description' => $project->getDescription(),
                'owner' => $project->getOwner(),
                'createdAt' => $project->getCreatedAt(),
                'updatedAt' => $project->getUpdatedAt(),
                'teams' => $project->getTeams()->map(function ($team) {
                    return [
                        'id' => $team->getId(),
                        'name' => $team->getName(),
                        'color' => $team->getColor(),
                    ];
                })->toArray(),
                'tickets_count' => $this->countTicketsByStatus($project),
            ];
            
            $projectsWithTickets[] = $projectData;
        }

        return $projectsWithTickets;
    }
}