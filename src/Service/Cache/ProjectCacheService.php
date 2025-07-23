<?php

namespace App\Service\Cache;

use Symfony\Component\Serializer\SerializerInterface;
use App\Entity\Project;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use App\Service\ProjectTicketService;

class ProjectCacheService
{
    private SerializerInterface $serializer;
    private CacheInterface $cache;
    private ProjectTicketService $projectTicketService;

    public function __construct(SerializerInterface $serializer, CacheInterface $cache, ProjectTicketService $projectTicketService)
    {
        $this->cache = $cache;
        $this->projectTicketService = $projectTicketService;
        $this->serializer = $serializer;
    }

 public function updateProjectListCache(string $hashedUi, Project $newProject): void
    {
        $cacheKey = 'dashboard_projects_user_' . $hashedUi;

        try {
            // Get the existing cached project list
            $projectsJson = $this->cache->get($cacheKey, function () {
                return json_encode([]); // Return empty array as JSON string if cache is empty
            });

            // Decode the JSON string to an array
            $projects = json_decode($projectsJson, true) ?? [];

            // Format the new project using ProjectTicketService
            $newProjectData = $this->projectTicketService->formatProjectsWithTicketCounts([$newProject])[0];

            // Add the new project to the list
            $projects[] = $newProjectData;

            // Delete the old cache entry
            $this->cache->delete($cacheKey);

            // Store the updated project list in the cache
            $this->cache->get($cacheKey, function () use ($projects) {
                return json_encode($projects); // Store as JSON string
            });
        } catch (\Throwable $e) {
            throw new \Exception('Failed to update project list cache: ' . $e->getMessage(), 500);
        }
    }
}