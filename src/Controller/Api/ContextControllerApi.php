<?php

namespace App\Controller\Api;

use App\Entity\Context;
use App\Entity\Project;
use App\Repository\ContextRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/context')]
class ContextControllerApi extends AbstractController
{

    #[Route('/all', name: 'api_context_all', methods: ['GET'])]
    public function getAll(ContextRepository $contextRepository): JsonResponse
    {
        $contexts = $contextRepository->findAll();

        return $this->json($contexts, 200, [], ['groups' => 'all-context:read']);
    }

    #[Route('/{id}/get-infos', name: 'api_context_get_infos', methods: ['GET'])]
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
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $project = $entityManager->getRepository(Project::class)->find($data['project']);


        $context = new Context();
        $context->setName($data['name']);
        $context->setProject($project);
        $context->setColor($data['color']);

        $entityManager->persist($context);
        $entityManager->flush();

        return $this->json(['message' => 'Context created!'], 201);
    }
}